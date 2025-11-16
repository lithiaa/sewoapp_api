import { ApiProperty } from '@nestjs/swagger';

export class RatingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_id: number;

  @ApiProperty()
  customer_id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false, nullable: true })
  review: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<RatingEntity>) {
    Object.assign(this, partial);
  }
}
