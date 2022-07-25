import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { NotificationGrpcService } from '../interfaces';

@Processor('account')
export class AccountProcessor {
  private readonly logger = new Logger(AccountProcessor.name);

  private notificationService: NotificationGrpcService;

  constructor(
    @Inject('NOTIFICATION_SERVICE_GRPC') private notificationGrpc: ClientGrpc,
    private readonly configService: ConfigService,
  ) {
    this.notificationService = this.notificationGrpc.getService<NotificationGrpcService>(
      'NotificationService',
    );
  }

  @Process('sendVerifyEmail')
  async sendVerifyEmail(job: Job) {
    const data = job.data;
    this.logger.log(`==== Executing [account][sendVerifyEmail][${job.id}] ====`)

    // const { account, token } = await this.accountsService.forgotPassword({ email }).toPromise();
    const { account, token, lang } = data;
    console.log('sendVerifyEmail', account.emailAddress, token);

    const oidc = this.configService.get('oidc');
    const url = `${oidc.issuer}auth/verify-email?u=${account.username}&token=${token}`;

    await firstValueFrom(this.notificationService.sendVerifyEmail({
      url,
      emailAddress: account.emailAddress,
      username: account.username,
      lang: lang || 'en'
    }));
  }
}
