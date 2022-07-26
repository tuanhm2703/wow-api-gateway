import { ApiProperty } from '@nestjs/swagger';

export class ListRequestDto {
  @ApiProperty({ required: false })
  itemsPerPage?: number;

  @ApiProperty({ required: false })
  pageNumber?: number;
}
