import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDocumentDto {
  @ApiProperty({
    description: 'Business address of the partner',
    example: 'Jl. Merdeka No. 1',
  })
  @IsNotEmpty()
  @IsString()
  business_address: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'NIB document (file)',
  })
  @IsOptional()
  nib_document?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'NPWP document (file)',
  })
  @IsOptional()
  npwp_document?: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Bank account document (file)',
  })
  @IsOptional()
  bank_account_document?: any;
}
