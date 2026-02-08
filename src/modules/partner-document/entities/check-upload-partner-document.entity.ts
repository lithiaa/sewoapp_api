import { ApiProperty } from '@nestjs/swagger';

export class CheckUploadPartnerDocumentEntity {
  @ApiProperty({
    example: true,
    description: 'Indicates whether partner document already uploaded',
  })
  is_uploaded: boolean;

  constructor(partial: Partial<CheckUploadPartnerDocumentEntity>) {
    Object.assign(this, partial);
  }
}
