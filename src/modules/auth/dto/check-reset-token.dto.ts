import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CheckResetTokenPasswordDto {
  @ApiProperty({
    description: 'The token sent to the user for password reset',
    example: '1234567890abcdef',
  })
  @IsNotEmpty({ message: 'Token should not be empty' })
  token: string;
}
