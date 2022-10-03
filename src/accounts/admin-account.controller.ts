import { UserGuard } from './../auth/guards/user.guard';
import { firstValueFrom } from 'rxjs';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { orderBy } from 'lodash';
import * as dayjs from 'dayjs';

@ApiTags('account')
@Controller('api/v1/admin/account')
export class AdminAccountController {
  [x: string]: any;
  constructor(
    private readonly natsService: NatsClient,
    @InjectQueue('account') private accountQueue: Queue,
  ) {}

  @Get('/generate-reports')
  async generateEmotionReport() {
    const payload = {
      options: { relations: ['profile'] },
    };
    const accountes = await firstValueFrom(this.natsService.send('admin.account.paginate', payload));
    (accountes.result || []).map(async account => {
      if (!account.email) return;

      const startDay = dayjs().startOf('week').toISOString();
      const endDay = dayjs().endOf('week').toISOString();
      const emotionData = await firstValueFrom(
        this.natsService.send('admin.user.getEmotionStatistics', {
          accountId: account.id,
          startDay,
          endDay
        }),
      );

      if (!emotionData.length) return;

      // Get the most 3 repeated emotions.
      const sortedEmotionData = orderBy(emotionData, ['finalScore'], ['desc']);
      const threeRepeatedEmotions = sortedEmotionData.slice(0, 3);

      // Trigger to send report email.
      await firstValueFrom(
        this.natsService.send('notification.sendEmotionWeeklyReport', {
          email: account.email,
          name: account.profile.name,
          emotionName: (threeRepeatedEmotions.map(emotion => emotion.emotion) || []).join(', '),
          emotionsExplain: threeRepeatedEmotions.map(emotion => ({ explain: emotion.content }))
        }),
      );
    })
    
    return accountes;
  }

  @UseGuards(UserGuard)
  @Post('paginate')
  @HttpCode(HttpStatus.OK)
  async paginateAccount(@Body() body) {
    body.options = {
      relations: ['profile'],
    };
    return await firstValueFrom(
      this.natsService.send('admin.account.paginate', body),
    );
  }

  @UseGuards(UserGuard)
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createACcount(@Body() body) {
    const acc = await firstValueFrom(
      this.natsService.send('admin.account.create', body),
    );
    await this.accountQueue.add(
      'sendWelcomeLetter',
      {
        email: acc.email,
        name: acc.profile.name,
      },
      {
        removeOnComplete: true,
      },
    );
    return acc;
  }

  @UseGuards(UserGuard)
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getAccountDetailsById(@Param('id') id) {
    return await firstValueFrom(
      this.natsService.send('admin.account.details', {
        id: id,
      }),
    );
  }
}
