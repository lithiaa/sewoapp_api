import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMitraRatingDto } from './create-mitra-rating.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMitraRatingDto {
  @ApiProperty({
    description: 'Updated rating score',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({
    description: 'Updated review comment',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  review?: string | null;
}
