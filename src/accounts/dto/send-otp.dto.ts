import { ApiProperty } from '@nestjs/swagger';

export class SendOTPDto {
  @ApiProperty({ required: true, example: '0932028536 | email@mail.com' })
  username: string;
}
