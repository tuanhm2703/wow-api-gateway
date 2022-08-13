import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { firstValueFrom } from 'rxjs';
import { SendOTPDto } from '@wow/accounts/dto/send-otp.dto';

@ApiTags('auth')
@Controller('api/v1/app/auth')
export class AuthController {
  constructor(
    private readonly natsService: NatsClient,
  ) {}

  // @Post()
  // async sendOtp(@Body() body: SendOTPDto) {
  //   const otp = await firstValueFrom(this.natsService.send('account.generateOtp', body));
  //   await firstValueFrom(this.natsService.send('notification.sendOTP', { ...body, otp: otp.token }));
  //   return {data: true};
  // }
}
