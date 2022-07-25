import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Patch,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bull';
import { JwtAuthGuard } from '@wow/shared/guards';
import { ChangePasswordRequest, UpdateAccountByIdRequest } from './interface/account.interface';
import { firstValueFrom } from 'rxjs';
import { Queue } from 'bull';

@ApiTags('me')
@Controller('api/v1/app/me')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly natsService: NatsClient,
    @InjectQueue('account') private accountQueue: Queue,
  ) { }

  @Get()
  async findMe(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('invalid user!');
    }

    const account = await this.natsService.send('account.getOne', req.user.id).toPromise();

    return {
      data: account,
    };
  }

  @Patch()
  async updateMe(@Req() req, @Body() accReq: UpdateAccountByIdRequest) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('invalid user!');
    }

    //accReq.id = req.user.id;

    const data = await this.natsService.send('account.update', { ...accReq, id: req.user.id }).toPromise();

    return {
      data,
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: any, @Body() accReq: ChangePasswordRequest) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('invalid user!');
    }

    accReq.emailAddress = req.user.emailAddress;
    const data = await this.natsService.send('account.changePassword', accReq).toPromise();
    return data;
  }

  @Post('resend-verify')
  @HttpCode(HttpStatus.OK)
  async resendVerifyEmail(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new UnauthorizedException('invalid user!');
    }

    const data = await firstValueFrom(this.natsService.send('account.recreateVerifyToken', {
      accountId: req.user.id
    }));

    const tokens = data.tokens;

    if (Array.isArray(tokens) && tokens.length) {
      let token = tokens[0];

      await this.accountQueue.add('sendVerifyEmail', {
        token: token.token,
        account: data
      }, {
        removeOnComplete: true,
      });

      delete data.tokens;
    }

    return { data };
  }
}
