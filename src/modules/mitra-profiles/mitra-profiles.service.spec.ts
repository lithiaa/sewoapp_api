import { Test, TestingModule } from '@nestjs/testing';
import { MitraProfilesService } from './mitra-profiles.service';

describe('MitraProfilesService', () => {
  let service: MitraProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MitraProfilesService],
    }).compile();

    service = module.get<MitraProfilesService>(MitraProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
