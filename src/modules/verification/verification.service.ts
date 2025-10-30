import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { PrismaService } from 'src/infra/database/prisma/prisma.service';
import { VerificationEntity } from './entities/verification.entity';
import { VerificationStatus } from 'generated/prisma';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';

@Injectable()
export class VerificationService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    dto: CreateVerificationDto,
    userId: number,
    documentFile?: Express.Multer.File,
    selfieFile?: Express.Multer.File,
  ): Promise<VerificationEntity> {
    const documentUrl = documentFile
      ? await this.cloudinary.uploadFile(
          documentFile,
          `verifications/documents/${userId}`,
        )
      : null;
    const selfieUrl = selfieFile
      ? await this.cloudinary.uploadFile(
          selfieFile,
          `verifications/selfies/${userId}`,
        )
      : null;

    const result = await this.prisma.userVerification.create({
      data: {
        ...dto,
        document_url: documentUrl ? documentUrl.secure_url : null,
        selfie_url: selfieUrl ? selfieUrl.secure_url : null,
        user_id: userId,
      },
    });

    return new VerificationEntity(result);
  }

  async findByUserId(userId: number): Promise<VerificationEntity | null> {
    const result = await this.prisma.userVerification.findUnique({
      where: { user_id: userId },
      select: {
        id: true,
        verif_type: true,
        document_number: true,
        document_url: true,
        selfie_url: true,
        verification_status: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
        verifiedBy: {
          select: {
            id: true,
            fullname: true,
            role: true,
          },
        },
      },
    });

    if (!result) throw new NotFoundException('Verification record not found');
    return new VerificationEntity(result);
  }

  async findAll(): Promise<VerificationEntity[]> {
    const results = await this.prisma.userVerification.findMany({
      select: {
        id: true,
        verif_type: true,
        document_number: true,
        document_url: true,
        selfie_url: true,
        verification_status: true,
        created_at: true,
        updated_at: true,
        verified_at: true,
        verifiedBy: {
          select: {
            id: true,
            fullname: true,
            role: true,
          },
        },
      },
    });
    return results.map((result) => new VerificationEntity(result));
  }

  async findOne(id: number): Promise<VerificationEntity | null> {
    const result = await this.prisma.userVerification.findUnique({
      where: { id },
    });

    if (!result) throw new NotFoundException('Verification record not found');

    return new VerificationEntity(result);
  }

  async verifyFromAdmin(
    userId: number,
    dto: UpdateVerificationDto,
    id: number,
  ): Promise<VerificationEntity> {
    const isApproved = dto.verification_status === VerificationStatus.APPROVED;

    const result = await this.prisma.userVerification.update({
      where: { id },
      data: {
        ...dto,
        verified_by: userId,
        verified_at: isApproved ? new Date() : null,
      },
    });

    return new VerificationEntity(result);
  }

  async remove(id: number): Promise<VerificationEntity> {
    const result = await this.prisma.userVerification.delete({
      where: { id },
    });

    if (!result) throw new NotFoundException('Verification record not found');

    return new VerificationEntity(result);
  }
}
