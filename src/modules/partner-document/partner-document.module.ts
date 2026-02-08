import { Module } from '@nestjs/common';
import { PartnerDocumentService } from './partner-document.service';
import { PartnerDocumentController } from './partner-document.controller';
import { CloudinaryModule } from 'src/infra/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [PartnerDocumentController],
  providers: [PartnerDocumentService],
})
export class PartnerDocumentModule {}
