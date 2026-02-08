import { ApiProperty } from '@nestjs/swagger';

export class GetDetailPartnerDocumentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mitra_id: number;

  @ApiProperty({ nullable: true })
  nib_document_url: string | null;

  @ApiProperty({ nullable: true })
  npwp_document_url: string | null;

  @ApiProperty({ nullable: true })
  bank_account_document_url: string | null;

  @ApiProperty()
  business_address: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<GetDetailPartnerDocumentEntity>) {
    Object.assign(this, partial);
  }
}
