import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty({ required: true, example: '0932028536' })
  username: string;
  
  @ApiProperty({ required: true })
  password: string;
}
