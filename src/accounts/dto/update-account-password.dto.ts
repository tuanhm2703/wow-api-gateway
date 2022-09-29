import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountPasswordDto {
  @ApiProperty({ required: false })
  oldPassword: string = null;

  @ApiProperty({ required: true })
  newPassword: string;

  @ApiProperty({ required: true })
  passwordConfirmation: string;
}
