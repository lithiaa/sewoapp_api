import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { CreatePartnerDocumentDto } from './dto/create-partner-document.dto';
import { UpdatePartnerDocumentDto } from './dto/update-partner-document.dto';
import { GetDetailPartnerDocumentEntity } from './entities/get-detail-partner-document.entity';
import { CheckUploadPartnerDocumentEntity } from './entities/check-upload-partner-document.entity';

@Injectable()
export class PartnerDocumentService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    dto: CreatePartnerDocumentDto,
    userId: number,
    files?: {
      nib_document: Express.Multer.File;
      npwp_document: Express.Multer.File;
      bank_account_document: Express.Multer.File;
    },
  ): Promise<GetDetailPartnerDocumentEntity> {
    const mitra = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });
    if (!mitra)
      throw new NotFoundException('Mitra profile not found for this user');

    const existing = await this.prisma.partnerDocument.findFirst({
      where: { mitra_id: mitra.id },
    });
    if (existing)
      throw new BadRequestException(
        'Partner document already exists for this mitra',
      );

    if (
      !files?.nib_document ||
      !files?.npwp_document ||
      !files?.bank_account_document
    ) {
      throw new BadRequestException('All documents are required');
    }

    const nibUploaded = await this.cloudinary.uploadFile(
      files.nib_document,
      'partner_documents',
    );

    const npwpUploaded = await this.cloudinary.uploadFile(
      files.npwp_document,
      'partner_documents',
    );

    const bankUploaded = await this.cloudinary.uploadFile(
      files.bank_account_document,
      'partner_documents',
    );

    const created = await this.prisma.partnerDocument.create({
      data: {
        mitra_id: mitra.id,
        nib_document_url: nibUploaded.secure_url,
        npwp_document_url: npwpUploaded.secure_url,
        bank_account_document_url: bankUploaded.secure_url,
        business_address: dto.business_address,
      },
    });

    return new GetDetailPartnerDocumentEntity(created);
  }

  async findAll(): Promise<GetDetailPartnerDocumentEntity[]> {
    const result = await this.prisma.partnerDocument.findMany();
    return result.map((r) => new GetDetailPartnerDocumentEntity(r));
  }

  async findById(id: number): Promise<GetDetailPartnerDocumentEntity> {
    const result = await this.prisma.partnerDocument.findUnique({
      where: { id },
    });
    if (!result) throw new NotFoundException('Partner document not found');
    return new GetDetailPartnerDocumentEntity(result);
  }

  async findByUserId(userId: number): Promise<GetDetailPartnerDocumentEntity> {
    const mitra = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });
    if (!mitra)
      throw new NotFoundException('Mitra profile not found for this user');

    const result = await this.prisma.partnerDocument.findFirst({
      where: { mitra_id: mitra.id },
    });
    if (!result)
      throw new NotFoundException('Partner document not found for this mitra');

    return new GetDetailPartnerDocumentEntity(result);
  }

  async update(
    id: number,
    dto: UpdatePartnerDocumentDto,
    userId: number,
    files?: {
      nib_document?: Express.Multer.File | undefined;
      npwp_document?: Express.Multer.File | undefined;
      bank_account_document?: Express.Multer.File | undefined;
    },
  ): Promise<GetDetailPartnerDocumentEntity> {
    const doc = await this.prisma.partnerDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Partner document not found');

    const mitra = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });
    if (!mitra)
      throw new NotFoundException('Mitra profile not found for this user');

    if (doc.mitra_id !== mitra.id) {
      throw new ForbiddenException(
        'You do not have permission to update this document',
      );
    }

    const dataToUpdate: any = { ...dto };

    if (files?.nib_document) {
      const uploaded = await this.cloudinary.uploadFile(
        files.nib_document,
        'partner_documents',
      );
      dataToUpdate.nib_document_url = uploaded.secure_url;
    }

    if (files?.npwp_document) {
      const uploaded = await this.cloudinary.uploadFile(
        files.npwp_document,
        'partner_documents',
      );
      dataToUpdate.npwp_document_url = uploaded.secure_url;
    }

    if (files?.bank_account_document) {
      const uploaded = await this.cloudinary.uploadFile(
        files.bank_account_document,
        'partner_documents',
      );
      dataToUpdate.bank_account_document_url = uploaded.secure_url;
    }

    const updated = await this.prisma.partnerDocument.update({
      where: { id },
      data: dataToUpdate,
    });

    return new GetDetailPartnerDocumentEntity(updated);
  }

  async delete(
    id: number,
    userId: number,
  ): Promise<GetDetailPartnerDocumentEntity> {
    const doc = await this.prisma.partnerDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Partner document not found');

    const mitra = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });
    if (!mitra)
      throw new NotFoundException('Mitra profile not found for this user');

    if (doc.mitra_id !== mitra.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this document',
      );
    }

    const deleted = await this.prisma.partnerDocument.delete({ where: { id } });
    return new GetDetailPartnerDocumentEntity(deleted);
  }

  async checkUploaded(
    userId: number,
  ): Promise<CheckUploadPartnerDocumentEntity> {
    const mitra = await this.prisma.mitraProfile.findFirst({
      where: { user_id: userId },
    });

    if (!mitra) {
      throw new NotFoundException('Mitra profile not found for this user');
    }

    const document = await this.prisma.partnerDocument.findFirst({
      where: { mitra_id: mitra.id },
    });

    return new CheckUploadPartnerDocumentEntity({
      is_uploaded: !!document,
    });
  }
}
