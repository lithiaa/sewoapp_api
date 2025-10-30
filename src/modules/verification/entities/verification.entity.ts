import { ApiProperty } from '@nestjs/swagger';

export class VerificationEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  verif_type: string;

  @ApiProperty()
  document_number: string;

  @ApiProperty()
  document_url: string;

  @ApiProperty()
  selfie_url: string;

  @ApiProperty()
  verification_status: string;

  @ApiProperty()
  verified_by: number | null;

  @ApiProperty()
  verified_at: Date | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<VerificationEntity>) {
    Object.assign(this, partial);
  }
}
