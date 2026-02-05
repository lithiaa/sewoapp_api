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
import { randomBytes, randomInt } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CheckResetTokenPasswordDto } from './dto/check-reset-token.dto';
import { Role } from 'generated/prisma';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { RequestForgotPasswordEntity } from './entities/request-forgot-password.entity';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<Auth> {
    const { confirm_password, ...userData } = dto;

    if (dto.role === Role.ADMIN) {
      throw new BadRequestException('ADMIN cannot be registered manually');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { username: dto.username },
          { phone_number: dto.phone_number },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already in use');
      }
      if (existingUser.username === dto.username) {
        throw new ConflictException('Username already in use');
      }
      if (existingUser.phone_number === dto.phone_number) {
        throw new ConflictException('Phone number already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const result = await this.prisma.user.create({
      data: {
        ...userData,
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

  async requestForgotPassword(
    dto: RequestForgotPasswordDto,
  ): Promise<RequestForgotPasswordEntity> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new NotFoundException('User not found');

    // delete existing tokens for the user
    await this.prisma.passwordResetToken.deleteMany({
      where: { email: dto.email },
    });

    const token = randomBytes(4).toString('hex');

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const result = await this.prisma.passwordResetToken.create({
      data: {
        email: dto.email,
        token,
        expires_at: expiresAt,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${dto.email}`;

    await this.mailService.sendMail(
      user.email,
      'Reset Password Request',
      `
        <h2>Hello, ${user.fullname}!</h2>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    );

    return new RequestForgotPasswordEntity(result);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const record = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: dto.token,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid token');

    if (record.expires_at < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.updateMany({
      where: { email: record.email },
      data: { password: hashedPassword },
    });

    await this.prisma.passwordResetToken.deleteMany({
      where: { email: record.email },
    });

    return { message: 'Password has been reset successfully' };
  }

  async checkResetToken(
    dto: CheckResetTokenPasswordDto,
  ): Promise<{ valid: boolean }> {
    const record = await this.prisma.passwordResetToken.findFirst({
      where: {
        token: dto.token,
      },
      orderBy: { created_at: 'desc' },
    });

    if (!record) throw new BadRequestException('Invalid token');

    if (record.expires_at < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    return { valid: true };
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    if (user.is_verified) {
      throw new BadRequestException('User is already verified');
    }

    await this.prisma.otpVerification.deleteMany({
      where: { user_id: user.id },
    });

    const otp = randomInt(100000, 999999).toString();

    await this.prisma.otpVerification.create({
      data: {
        user_id: user.id,
        otp_code: otp,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 menit
      },
    });

    await this.mailService.sendMail(
      user.email,
      'Verifikasi Akun Anda - OTP Baru',
      `
      <h2>Halo, ${user.fullname}!</h2>
      <p>Anda meminta kode OTP baru. Kode OTP Anda adalah:</p>
      <h1>${otp}</h1>
      <p>Kode ini berlaku selama 5 menit.</p>
    `,
    );

    return { message: 'OTP has been sent to your email' };
  }
}
