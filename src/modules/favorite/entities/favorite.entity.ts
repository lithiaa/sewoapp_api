import { ApiProperty } from '@nestjs/swagger';

export class FavoriteEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  vehicle_id: number;

  @ApiProperty()
  vehicle_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vehicle_year: number;

  constructor(partial: Partial<FavoriteEntity>) {
    Object.assign(this, partial);
  }
}
