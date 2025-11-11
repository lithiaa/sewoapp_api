import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { VerificationModule } from './modules/verification/verification.module';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';
import { CategoryModule } from './modules/category/category.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';

@Module({
  imports: [PrismaModule, AuthModule, VerificationModule, CloudinaryModule, CategoryModule, VehicleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
