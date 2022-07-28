import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { Queue } from 'bull';
import { CreateAccountDto } from './dto/create-account.dto';
import { firstValueFrom } from 'rxjs';
import { VerifyAccountOTPDto } from './dto/verify-account-otp.dto';

@ApiTags('account')
@Controller('api/v1/app/account')
export class AppAccountsController {
  constructor(
    private readonly natsService: NatsClient,
    @InjectQueue('account') private accountQueue: Queue,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Body() acc: CreateAccountDto) {
    try {
      const data = await firstValueFrom(this.natsService.send('account.create', acc));

      // Send verify otp
      const tokens = data.tokens;
      if (Array.isArray(tokens) && tokens.length) {
        let token = tokens[0];

        await this.accountQueue.add('sendVerifyOtp', {
          token: token.token,
          phone: data.phone
        }, {
          removeOnComplete: true,
        });
        
        delete data.tokens;
      }

      return { data };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('verify-otp')
  async verifyOTP(@Body() payload: VerifyAccountOTPDto) {
    const data = await firstValueFrom(this.natsService.send('account.verifyOtp', payload));
    console.log("line 56 - data", data);
    return data;
  }
}
