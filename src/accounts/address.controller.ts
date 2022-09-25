import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { first, firstValueFrom } from 'rxjs';
import { AccountGuard } from '@wow/auth/guards/account.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('account')
@Controller('api/v1/app/address')
export class AddressController {
  constructor(private readonly natsService: NatsClient) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCityInfo(@Query() query) {
    try {
      const data = await firstValueFrom(
        this.natsService.send('address.city.info', query),
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
