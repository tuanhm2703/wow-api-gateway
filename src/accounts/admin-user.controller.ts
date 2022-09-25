import { firstValueFrom } from 'rxjs';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserGuard } from '@wow/auth/guards/user.guard';

@ApiTags('user')
@Controller('api/v1/admin/user')
export class AdminUserController {
  [x: string]: any;
  constructor(private readonly natsService: NatsClient) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() body) {
    return await firstValueFrom(
      this.natsService.send('admin.user.login', body),
    );
  }

  @UseGuards(UserGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async userGetInfo(@Request() request) {
    return await firstValueFrom(
      this.natsService.send('admin.user.getOne', request.user.username),
    );
  }
}
