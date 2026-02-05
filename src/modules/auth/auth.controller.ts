import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Auth } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestForgotPasswordEntity } from './entities/request-forgot-password.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RequestForgotPasswordDto } from './dto/request-forgot-password.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: Auth,
  })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);

    return {
      data: data,
      message: 'User registered successfully',
    };
  }

  @Post('login')
  @ApiCreatedResponse({
    description: 'The user has been logged in successfully',
    type: Auth,
  })
  async login(@Body() dto: LoginDto) {
    const data = await this.authService.login(dto);

    return {
      data: data,
      message: 'The user has been logged in successfully',
    };
  }

  @Get('verify')
  @ApiCreatedResponse({
    description: 'Email verified successfully',
    type: Object,
  })
  async verifyOtp(@Body() dto: { email: string; otp: string }) {
    return this.authService.verifyOtp(dto.email, dto.otp);
  }

  @Post('reset-password/request')
  @ApiCreatedResponse({
    description: 'Password reset token sent successfully',
    type: RequestForgotPasswordEntity,
  })
  async requestResetPassword(@Body() dto: RequestForgotPasswordDto) {
    const data = await this.authService.requestForgotPassword(dto);

    return {
      data: data,
      message: 'Password reset token sent successfully',
    };
  }

  @Post('reset-password')
  @ApiOkResponse({
    description: 'Password has been reset successfully',
  })
  async resetPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto);

    return {
      message: 'Password has been reset successfully',
    };
  }

  @Get('reset-password/check')
  @ApiOkResponse({
    description: 'Password reset token is valid',
  })
  @Get('reset-password/check')
  async checkResetToken(@Query('token') token: string) {
    await this.authService.checkResetToken({ token });

    return {
      data: null,
      message: 'Password reset token is valid',
    };
  }

  @Post('resend-otp')
  @ApiCreatedResponse({
    description: 'Resend OTP successfully',
  })
  async resendOtp(@Body() dto: ResendOtpDto) {
    const data = await this.authService.resendOtp(dto.email);
    return {
      data: null,
      message: data.message,
    };
  }
}
