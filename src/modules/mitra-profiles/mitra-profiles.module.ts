import { Module } from '@nestjs/common';
import { MitraProfilesService } from './mitra-profiles.service';
import { MitraProfilesController } from './mitra-profiles.controller';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [MitraProfilesController],
  providers: [MitraProfilesService],
})
export class MitraProfilesModule {}
