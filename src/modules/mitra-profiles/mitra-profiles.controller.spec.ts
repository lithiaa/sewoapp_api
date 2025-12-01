import { Test, TestingModule } from '@nestjs/testing';
import { MitraProfilesController } from './mitra-profiles.controller';
import { MitraProfilesService } from './mitra-profiles.service';

describe('MitraProfilesController', () => {
  let controller: MitraProfilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MitraProfilesController],
      providers: [MitraProfilesService],
    }).compile();

    controller = module.get<MitraProfilesController>(MitraProfilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
