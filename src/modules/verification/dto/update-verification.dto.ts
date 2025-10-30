import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { CreateVerificationDto } from './create-verification.dto';
import { VerificationStatus } from 'generated/prisma';

export class UpdateVerificationDto extends PartialType(CreateVerificationDto) {
  @ApiProperty({
    example: 1,
    description: 'ID of the admin who verified the user',
    required: false,
  })
  @IsInt({ message: 'verified_by must be an integer value' })
  @IsOptional()
  verified_by?: number;

  @ApiProperty({
    example: '2025-10-30T12:00:00Z',
    description: 'Date when the verification was approved or rejected',
    required: false,
  })
  @IsOptional()
  verified_at?: Date;

  @ApiProperty({
    example: 'APPROVED',
    enum: VerificationStatus,
    description: 'Updated status of the verification process',
    required: false,
  })
  @IsEnum(VerificationStatus, {
    message: 'verification_status must be a valid enum value',
  })
  @IsOptional()
  verification_status?: VerificationStatus;
}
