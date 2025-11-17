import { ApiProperty } from '@nestjs/swagger';

export class RequestForgotPasswordEntity {
  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  expires_at: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<RequestForgotPasswordEntity>) {
    Object.assign(this, partial);
  }
}
