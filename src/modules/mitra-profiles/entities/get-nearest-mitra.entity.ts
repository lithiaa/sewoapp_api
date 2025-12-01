import { ApiProperty } from '@nestjs/swagger';

export class GetNearestMitraEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mitra_image: string;

  @ApiProperty()
  mitra_name: string;

  @ApiProperty()
  mitra_address: string;

  @ApiProperty()
  operating_hours: string;

  @ApiProperty()
  mitra_description?: string | null;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  distance_km: number;

  constructor(partial: Partial<GetNearestMitraEntity>) {
    Object.assign(this, partial);
  }
}
