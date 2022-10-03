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
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@ApiTags('account')
@Controller('api/v1/admin/account')
export class AdminAccountController {
  [x: string]: any;
  constructor(
    private readonly natsService: NatsClient,
    @InjectQueue('account') private accountQueue: Queue,
  ) {}

  @UseGuards(UserGuard)
  @Get('paginate')
  @HttpCode(HttpStatus.OK)
  async paginateAccount(@Param() param) {
    param.options = {
      relations: ['profile'],
    };
    return await firstValueFrom(
      this.natsService.send('admin.account.paginate', param),
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

  @UseGuards(UserGuard)
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateAccount(@Param('id') id, @Body() body) {
    body.accountId = id;
    console.log(body);
    return await firstValueFrom(
      this.natsService.send('admin.account.update', body),
    );
  }

  @UseGuards(UserGuard)
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@Param('id') id) {
    return await firstValueFrom(
      this.natsService.send('admin.account.delete', id),
    );
  }
}
