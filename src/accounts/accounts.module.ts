import { NatsClientModule } from '@nestjs-ex/nats-strategy';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nats } from '../config';
import User from '@wow/models/account.model';
import { AppAccountsController } from './app-accounts.controller';

@Module({
  imports: [
    NatsClientModule.registerAsync(nats()),
    TypeOrmModule.forFeature([User]),
    // BullModule.registerQueueAsync(...queues(['account'])),
    BullModule.registerQueue({
      name: 'account'
    })
  ],
  controllers: [
    AppAccountsController
  ],
})
export class AccountsModule { }
