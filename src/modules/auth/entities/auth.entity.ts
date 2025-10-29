import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class Auth {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  address: string;

  @Exclude()
  password: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  is_verified: boolean;

  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial);
  }
}
