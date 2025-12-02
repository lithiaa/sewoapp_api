import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerMitraRatingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;
}

export class GetAllMitraRatingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  review: string | null;

  @ApiProperty({ type: GetCustomerMitraRatingEntity })
  customer: GetCustomerMitraRatingEntity;
}
