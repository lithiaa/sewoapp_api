import { ApiProperty } from '@nestjs/swagger';

export class MitraEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mitra_name: string;

  @ApiProperty()
  mitra_address: string;

  @ApiProperty()
  mitra_description?: string | null;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;
}

export class NearestVehicleEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_name: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  distance_km: number;

  @ApiProperty({ type: MitraEntity })
  mitra: MitraEntity;

  @ApiProperty({ description: 'Average rating of the vehicle', example: 4.5 })
  average_rating?: number;

  @ApiProperty({ description: 'Total number of ratings', example: 12 })
  total_ratings?: number;

  constructor(partial: Partial<NearestVehicleEntity>) {
    Object.assign(this, partial);
  }
}
