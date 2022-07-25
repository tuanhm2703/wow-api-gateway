import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ required: true, example: '0932028536' })
  phone: string;
}
