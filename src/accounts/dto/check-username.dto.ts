import { ApiProperty } from '@nestjs/swagger';

export class CheckUsernameDto {
  @ApiProperty({ required: true, example: '0932028536' })
  username: string;
}
