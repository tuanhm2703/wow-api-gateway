import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class Emotion {
  id: string;
  intensity: number;
  time: number;
  type: number;
}

export class EmotionCheckinDto {
  @ApiProperty({ required: true, example: 'ahsdjfkhs' })
  accountId: string;

  @ApiProperty({ required: true, example: 'ISO String' })
  checkinDate: string;

  @ApiProperty({ required: true, example: '[{}, {}]' })
  emotions: Emotion[];
}
