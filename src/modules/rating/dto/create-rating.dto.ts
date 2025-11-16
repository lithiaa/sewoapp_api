import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty({
    description: 'ID of the vehicle being rated',
  })
  @IsNumber()
  vehicle_id: number;

  @ApiProperty({
    description: 'Rating score given to the vehicle (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    description: 'Comment review for the vehicle',
    required: false,
  })
  @IsOptional()
  @IsString()
  review?: string;
}
