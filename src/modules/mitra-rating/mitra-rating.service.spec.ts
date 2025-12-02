import { Test, TestingModule } from '@nestjs/testing';
import { MitraRatingService } from './mitra-rating.service';

describe('MitraRatingService', () => {
  let service: MitraRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MitraRatingService],
    }).compile();

    service = module.get<MitraRatingService>(MitraRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
