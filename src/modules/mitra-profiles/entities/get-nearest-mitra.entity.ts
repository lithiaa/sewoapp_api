import { ApiProperty } from '@nestjs/swagger';

export class GetNearestMitraEntity {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'Image of the mitra',
  })
  mitra_image: string;

  @ApiProperty({
    description: 'Name of the mitra',
  })
  mitra_name: string;

  @ApiProperty({
    description: 'Address of the mitra',
  })
  mitra_address: string;

  @ApiProperty({
    description: 'Operating hours of the mitra',
  })
  operating_hours: string;

  @ApiProperty({
    description: 'Description of the mitra',
  })
  mitra_description?: string | null;

  @ApiProperty({
    description: 'Longitude of the mitra location',
  })
  longitude: number;

  @ApiProperty({
    description: 'Latitude of the mitra location',
  })
  latitude: number;

  @ApiProperty({
    description: 'Distance from the given location to the mitra in kilometers',
  })
  distance_km: number;

  @ApiProperty({
    description: 'Vehicle count owned by the mitra',
  })
  vehicle_count: number;

  constructor(partial: Partial<GetNearestMitraEntity>) {
    Object.assign(this, partial);
  }
}
