import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  isEnum,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransmissionType } from 'generated/prisma';

export class GetVehiclesFilterDto {
  @ApiPropertyOptional({ description: 'Filter berdasarkan kategori kendaraan' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: TransmissionType,
    description: 'Filter berdasarkan transmisi',
  })
  @IsOptional()
  @IsEnum(TransmissionType, {
    message: 'Transmission must be a valid enum value',
  })
  transmission?: TransmissionType;

  @ApiPropertyOptional({
    description: 'Filter berdasarkan kapasitas (small, medium, large)',
  })
  @IsOptional()
  @IsString()
  capacity?: 'small' | 'medium' | 'large'; // small=<4, medium=4-6, large=>6

  @ApiPropertyOptional({ description: 'Harga minimum' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Harga maksimum' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  maxPrice?: number;
}
