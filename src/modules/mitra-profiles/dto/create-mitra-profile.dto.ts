import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMitraProfileDto {
  @ApiProperty({
    example: 'Mitra Motor Jaya',
    description: 'The name of the mitra',
  })
  @IsString()
  @IsNotEmpty()
  mitra_name: string;

  @ApiProperty({
    example: 'Jl. Merdeka No. 45, Jakarta',
    description: 'The address of the mitra',
  })
  @IsString()
  @IsNotEmpty()
  mitra_address: string;

  @ApiProperty({
    example: 'Mitra rental kendaraan terpercaya di Jakarta',
    description: 'A brief description of the mitra',
  })
  @IsOptional()
  @IsString()
  mitra_description?: string | null;

  @ApiProperty({
    example:
      'Mitra rental kendaraan terpercaya di Jakarta yang telah beroperasi sejak tahun 2005 dan menyediakan berbagai jenis kendaraan untuk kebutuhan transportasi Anda.',
    description: 'General information about the mitra',
  })
  @IsOptional()
  @IsString()
  general_information?: string | null;

  @ApiProperty({
    example: '08:00 - 20:00',
    description: 'Operating hours of the mitra',
  })
  @IsString()
  @IsNotEmpty()
  operating_hours: string;

  @ApiProperty({
    example: '08123456789',
    description: 'Contact number of the mitra',
  })
  @IsString()
  @IsNotEmpty()
  contact_number: string;

  @ApiProperty({
    example: -6.2,
    description: 'Latitude of the mitra location',
  })
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({
    example: 106.816666,
    description: 'Longitude of the mitra location',
  })
  @IsNotEmpty()
  longitude: string;
}
