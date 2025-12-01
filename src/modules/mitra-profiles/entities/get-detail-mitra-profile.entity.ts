import { ApiProperty } from '@nestjs/swagger';

export class GetDetailMitraProfileEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  mitra_name: string;

  @ApiProperty()
  mitra_address: string;

  @ApiProperty()
  mitra_image: string;

  @ApiProperty()
  operating_hours: string;

  @ApiProperty()
  mitra_description: string | null;

  @ApiProperty()
  general_information: string | null;

  @ApiProperty()
  contact_number: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<GetDetailMitraProfileEntity>) {
    Object.assign(this, partial);
  }
}
