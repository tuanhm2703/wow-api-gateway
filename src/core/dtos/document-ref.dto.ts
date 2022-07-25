import { ApiProperty } from '@nestjs/swagger';

export class DocumentRefDto {
  @ApiProperty({ example: 'sampleId' })
  id: string;

  @ApiProperty({ required: false })
  name?: string;
}
