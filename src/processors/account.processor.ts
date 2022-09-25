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
    @Inject('NOTIFICATION_SERVICE_NATS') private notificationNats: NatsClient,
  ) {}

  @Process('sendVerifyOtp')
  async sendVerifyEmail(job: Job) {
    const data = job.data;
    this.logger.log(`==== Executing [account][sendVerifyOtp][${job.id}] ====`);

    const { email, phone, token } = data;
    let phoneNumber = phone;
    if (phone) {
      const region = '+84'; // hardecode for vietnam.
      const isHasRegion = phone.indexOf(region) === 0;
      phoneNumber = (isHasRegion && phone) || `${region}${phone}`;
    }

    console.log('sendVerifyOtp', data, email, phone, phoneNumber, token);

    const response = await firstValueFrom(
      this.notificationNats.send('notification.sendOTP', {
        username: email || phoneNumber,
        otp: token,
      }),
    );
  }

  @Process('sendWelcomeLetter')
  async sendWelcomeLetter(job: Job) {
    const data = job.data;

    console.log(data);

    const { email, name } = data;
    const response = await firstValueFrom(
      this.notificationNats.send('notification.sendWelcomeLetter', {
        email,
        name,
      }),
    );
  }
}
