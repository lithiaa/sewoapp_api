import { ApiProperty } from '@nestjs/swagger';
import { VehicleStatus } from 'generated/prisma';

export class GetVehicleByMitraEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vehicle_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image_url: string;

  @ApiProperty({
    enum: VehicleStatus,
  })
  status: VehicleStatus;

  @ApiProperty()
  is_favorite: boolean;
}
