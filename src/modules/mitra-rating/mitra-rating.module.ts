import { Module } from '@nestjs/common';
import { MitraRatingService } from './mitra-rating.service';
import { MitraRatingController } from './mitra-rating.controller';

@Module({
  controllers: [MitraRatingController],
  providers: [MitraRatingService],
})
export class MitraRatingModule {}
