import {
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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
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

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
