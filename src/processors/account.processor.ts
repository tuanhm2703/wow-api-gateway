import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientNats } from '@nestjs/microservices';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { NotificationGrpcService } from '../interfaces';
import { NatsClient } from '@nestjs-ex/nats-strategy';

@Processor('account')
export class AccountProcessor {
  private readonly logger = new Logger(AccountProcessor.name);

  constructor(
    @Inject('NOTIFICATION_SERVICE_NATS') private notificationNats: ClientNats,
  ) {}

  @Process('sendVerifyOtp')
  async sendVerifyEmail(job: Job) {
    const data = job.data;
    this.logger.log(`==== Executing [account][sendVerifyOtp][${job.id}] ====`);

    const { phone, token } = data;
    console.log('sendVerifyOtp', phone, token);

    await firstValueFrom(
      this.notificationNats.send('notification.verifyOtp', {
        phone,
        otp: token,
      }),
    );
  }
}
