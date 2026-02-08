import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDocumentController } from './partner-document.controller';
import { PartnerDocumentService } from './partner-document.service';

describe('PartnerDocumentController', () => {
  let controller: PartnerDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerDocumentController],
      providers: [PartnerDocumentService],
    }).compile();

    controller = module.get<PartnerDocumentController>(PartnerDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
