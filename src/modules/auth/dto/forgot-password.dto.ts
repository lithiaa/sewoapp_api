import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Token received for password reset',
    example: '1234567890abcdef',
  })
  @IsNotEmpty({ message: 'Token should not be empty' })
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newSecurePassword123!',
  })
  @IsNotEmpty({ message: 'New password should not be empty' })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of the new password',
    example: 'newSecurePassword123!',
  })
  @IsNotEmpty({ message: 'Confirmation password should not be empty' })
  @Match('newPassword', {
    message: 'Confirmation password must match new password',
  })
  confirmPassword: string;
}
