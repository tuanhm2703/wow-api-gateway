import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientNats } from '@nestjs/microservices';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { NotificationGrpcService } from '../interfaces';
import { NatsClient } from '@nestjs-ex/nats-strategy';

@Processor('reward')
export class RewardProcessor {
  private readonly logger = new Logger(RewardProcessor.name);

  constructor(
    @Inject('ACCOUNT_SERVICE_NATS') private accountNats: NatsClient,
  ) {}

  @Process('rewardUpdateProfile')
  async rewardUpdateProfile(job: Job) {
    const data = job.data;
    this.logger.log(`==== Executing [account][rewardUpdateProfile][${job.id}] ====`);

    const response = await firstValueFrom(this.accountNats.send('account.wallet.update-profile-reward', data));
    this.logger.log(response);
  }
}
