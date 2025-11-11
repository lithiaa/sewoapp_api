import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { Auth } from './entities/auth.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
