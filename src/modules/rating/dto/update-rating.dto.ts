import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRatingDto {
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
