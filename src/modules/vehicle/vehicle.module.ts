import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
