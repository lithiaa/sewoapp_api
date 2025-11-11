import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from '../../infra/auth/jwt.interface';
import { MailService } from 'src/infra/mail/mail.service';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<Auth> {
    const checkUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (checkUser) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const otp = randomInt(100000, 999999).toString();

    await this.prisma.otpVerification.create({
      data: {
        user_id: result.id,
        otp_code: otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const emailToken = this.jwtService.sign(
      { email: result.email },
      { secret: process.env.EMAIL_SECRET, expiresIn: '1d' },
    );

    const verifUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${emailToken}`;

    await this.mailService.sendMail(
      result.email,
      'Verifikasi Akun Anda',
      `
        <h2>Halo, ${result.fullname}!</h2>
        <p>Terima kasih sudah mendaftar di SewoApp.</p>
        <p>Kode OTP Anda adalah:</p>
        <h1>${otp}</h1>
        <p>Kode ini berlaku selama 5 menit.</p>
      `,
    );

    return new Auth(result);
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const isVerified = user.is_verified;

    if (!isVerified)
      throw new UnauthorizedException(
        'User email is not verified. Please verify your email before logging in.',
      );

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otpRecord = await this.prisma.otpVerification.findFirst({
      where: {
        user_id: user.id,
        otp_code: otp,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!otpRecord)
      throw new BadRequestException('Invalid OTP, please try again.');

    if (otpRecord.expires_at < new Date()) {
      throw new BadRequestException(
        'OTP has expired, please request a new one.',
      );
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { is_verified: true },
    });

    await this.prisma.otpVerification.delete({
      where: { id: otpRecord.id },
    });

    return { message: 'Email verified successfully' };
  }
}
