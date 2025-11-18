import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class PartnerVehcileEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullname: string;
}

export class CategoryVehicleEntity {
  @ApiProperty()
  name: string;
}

export class VehicleEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Exclude()
  category_id: number;

  @ApiProperty()
  @Exclude()
  partner_id: number;

  @ApiProperty()
  vehicle_name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vehicle_year: number;

  @ApiProperty()
  license_plate: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty()
  status: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: PartnerVehcileEntity })
  partner: PartnerVehcileEntity;

  @ApiProperty({ type: CategoryVehicleEntity })
  category: CategoryVehicleEntity;

  @ApiProperty()
  is_favorited: boolean;
}
