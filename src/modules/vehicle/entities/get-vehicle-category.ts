import { ApiProperty } from '@nestjs/swagger';
import { MitraEntity } from './get-nearest-vehicle';

export class CategoryByVehicleEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}

export class MitraByVehicleEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  mitra_name: string;

  @ApiProperty()
  mitra_address: string;

  @ApiProperty()
  mitra_description?: string | null;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  latitude: string;
}

export class GetVehicleCategoryEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_name: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: MitraByVehicleEntity })
  mitra: MitraByVehicleEntity;

  @ApiProperty({ type: CategoryByVehicleEntity })
  category: CategoryByVehicleEntity;

  constructor(partial: Partial<GetVehicleCategoryEntity>) {
    Object.assign(this, partial);
  }
}
