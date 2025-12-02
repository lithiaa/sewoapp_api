import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateMitraRatingDto {
  @ApiProperty({
    description: 'ID of the mitra being rated',
  })
  @IsNumber()
  mitra_id: number;

  @ApiProperty({
    description: 'Rating score given to the mitra (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comment review for the mitra',
    required: false,
  })
  @IsOptional()
  @IsString()
  review?: string;
}
