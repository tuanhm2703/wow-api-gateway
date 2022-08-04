import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Body,
  BadRequestException,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { Queue } from 'bull';
import { CreateAccountDto } from './dto/create-account.dto';
import { first, firstValueFrom } from 'rxjs';
import { LoginAccountDto } from './dto/login-account.dto';
import { AccountGuard } from '@wow/auth/guards/account.guard';
import { VerifyAccountOTPDto } from './dto/verify-account-otp.dto';
import { CheckUsernameDto } from './dto/check-username.dto';

@ApiTags('account')
@Controller('api/v1/app/account')
export class AppAccountsController {
  constructor(
    private readonly natsService: NatsClient,
    @InjectQueue('account') private accountQueue: Queue,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Body() acc: CreateAccountDto) {
    try {
      const data = await firstValueFrom(
        this.natsService.send('account.create', acc),
      );

      // Send verify otp
      const tokens = data.tokens;
      if (Array.isArray(tokens) && tokens.length) {
        const token = tokens[0];

        await this.accountQueue.add(
          'sendVerifyOtp',
          {
            token: token.token,
            phone: data.phone,
          },
          {
            removeOnComplete: true,
          },
        );

        delete data.tokens;
      }

      return { data };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async loginAccount(@Body() acc: LoginAccountDto) {
    try {
      const data = await firstValueFrom(
        this.natsService.send('account.login', acc),
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @Post('/exists')
  @HttpCode(HttpStatus.OK)
  async checkValidUsername(@Body() body: CheckUsernameDto) {
    try {
      const data = await firstValueFrom(
        this.natsService.send('account.exists', body),
      );
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  @UseGuards(AccountGuard)
  @Get('/profile/general')
  @HttpCode(HttpStatus.OK)
  async getGeneralProfileAccount(@Request() req) {
    try {
      const data = await firstValueFrom(
        this.natsService.send('account.profile.general', req.user),
      );
      return data;
    } catch (error) {
      return error;
    }
  }

  @Post('verify-otp')
  async verifyOTP(@Body() payload: VerifyAccountOTPDto) {
    const data = await firstValueFrom(
      this.natsService.send('account.verifyOtp', payload),
    );
    console.log('line 56 - data', data);
    return data;
  }
}
