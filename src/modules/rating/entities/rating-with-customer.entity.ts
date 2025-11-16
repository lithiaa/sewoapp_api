import { ApiProperty } from '@nestjs/swagger';

export class RatingCustomerEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullname: string;
}

export class RatingWithCustomerEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false, nullable: true })
  review: string | null;

  @ApiProperty()
  created_at: Date;

  @ApiProperty({ type: RatingCustomerEntity })
  customer: RatingCustomerEntity;

  constructor(partial: Partial<RatingWithCustomerEntity>) {
    Object.assign(this, partial);
  }
}
