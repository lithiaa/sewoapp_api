import { Test, TestingModule } from '@nestjs/testing';
import { MitraRatingController } from './mitra-rating.controller';
import { MitraRatingService } from './mitra-rating.service';

describe('MitraRatingController', () => {
  let controller: MitraRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MitraRatingController],
      providers: [MitraRatingService],
    }).compile();

    controller = module.get<MitraRatingController>(MitraRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
