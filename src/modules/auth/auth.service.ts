import {
  BadRequestException,
  ConflictException,
  Injectable,
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

    const emailToken = this.jwtService.sign(
      { email: result.email },
      { secret: process.env.EMAIL_SECRET, expiresIn: '1d' },
    );

    const verifUrl = `${process.env.FRONTEND_URL}/api/auth/verify-email?token=${emailToken}`;

    await this.mailService.sendMail(
      result.email,
      'Verifikasi Email Anda',
      `
        <h2>Halo, ${result.fullname}!</h2>
        <p>Terima kasih sudah mendaftar di SewoApp.</p>
        <p>Silakan klik tautan berikut untuk memverifikasi email Anda:</p>
        <a href="${verifUrl}" target="_blank">Verifikasi Sekarang</a>
        <p>Link ini akan kadaluarsa dalam 1 jam.</p>
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

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.EMAIL_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { email: decoded.email },
      });

      if (!user) throw new UnauthorizedException('User not found');
      if (user.is_verified) return { message: 'Email has been verified' };

      await this.prisma.user.update({
        where: { email: decoded.email },
        data: { is_verified: true },
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid token or token has expired');
    }
  }
}
