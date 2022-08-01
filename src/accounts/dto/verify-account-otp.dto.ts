import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountOTPDto {
  @ApiProperty({ required: true, example: '0932028536 | email@mail.com' })
  username: string;
  
  @ApiProperty({ required: true, example: '123456' })
  otp: string;
}
