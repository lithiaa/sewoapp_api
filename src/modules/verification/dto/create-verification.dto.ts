import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { VerificationStatus, VerificationType } from 'generated/prisma';

export class CreateVerificationDto {
  @ApiProperty({
    example: 'KTP',
    enum: VerificationType,
    description:
      'Type of verification document. Allowed values: KTP, SIM, PASSPORT, NPWP',
  })
  @IsEnum(VerificationType, {
    message: 'verif_type must be KTP, SIM, PASSPORT, or NPWP',
  })
  @IsNotEmpty({ message: 'verif_type should not be empty' })
  verif_type: VerificationType;

  @ApiProperty({
    example: '1234567890',
    description: 'Identification number of the verification document',
  })
  @IsNotEmpty({ message: 'document_number should not be empty' })
  document_number: string;

  @IsOptional()
  document_url?: string;

  @IsOptional()
  selfie_url?: string;
}
