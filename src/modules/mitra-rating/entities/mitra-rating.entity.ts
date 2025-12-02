import { ApiProperty } from '@nestjs/swagger';

export class MitraRatingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mitra_id: number;

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

  constructor(partial: Partial<MitraRatingEntity>) {
    Object.assign(this, partial);
  }
}
