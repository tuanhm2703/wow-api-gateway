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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('account')
@Controller('api/v1/admin/account')
export class AdminAccountController {
  [x: string]: any;
  constructor(private readonly natsService: NatsClient) {}

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
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getAccountById(@Param('id') id) {
    return await firstValueFrom(
      this.natsService.send('admin.account.getOneWithOptions', {
        conditions: { id: id },
        options: {
          relations: ['profile'],
        },
      }),
    );
  }
}
