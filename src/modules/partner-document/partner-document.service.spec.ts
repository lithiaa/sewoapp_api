import { Test, TestingModule } from '@nestjs/testing';
import { PartnerDocumentService } from './partner-document.service';

describe('PartnerDocumentService', () => {
  let service: PartnerDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerDocumentService],
    }).compile();

    service = module.get<PartnerDocumentService>(PartnerDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
