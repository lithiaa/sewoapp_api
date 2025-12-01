import { ApiProperty } from '@nestjs/swagger';

export class GetAllMitraProfileEntity {
  @ApiProperty()
  id: number;

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

  constructor(partial: Partial<GetAllMitraProfileEntity>) {
    Object.assign(this, partial);
  }
}
