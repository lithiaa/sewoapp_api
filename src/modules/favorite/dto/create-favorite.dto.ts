import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'ID of the user who is adding the favorite',
  })
  @IsNumber()
  vehicle_id: number;
}
