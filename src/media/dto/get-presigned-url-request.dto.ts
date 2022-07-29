import { ApiProperty } from '@nestjs/swagger';

export class GetPresignedUrlRequest {
  @ApiProperty({ required: true })
  key: string;

  @ApiProperty({ required: false })
  bucket?: string;
}
