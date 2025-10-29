import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/infra/database/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/infra/auth/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'supersecret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
