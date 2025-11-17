import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user requesting a password reset',
  })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;
}
