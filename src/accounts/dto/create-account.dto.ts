import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountDto {
  @ApiProperty({ required: true, example: '0932028536' })
  phone: string;
  
  @ApiProperty({ required: false })
  password: string;

  @ApiProperty({ required: false })
  idFrontImg: string;

  @ApiProperty({ required: false })
  idBackImg: string;
  
  @ApiProperty({ required: false })
  gender: string;
}
  