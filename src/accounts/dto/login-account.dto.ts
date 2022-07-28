import { ApiProperty } from '@nestjs/swagger';

export class LoginAccountDto {
  @ApiProperty({ required: true, example: '0932028536' })
  phone: string;
  @ApiProperty({ required: true, example: '0932028536' })
  password: string;
}
