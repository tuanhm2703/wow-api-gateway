import { AppConsultationController } from './app-consultation.controller';
import { NatsClientModule } from '@nestjs-ex/nats-strategy';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nats } from '../config';
import User from '@wow/models/account.model';
import { AppAccountsController } from './app-accounts.controller';
import { AddressController } from './address.controller';
import Account from '@wow/models/account.model';

@Module({
  imports: [
    NatsClientModule.registerAsync(nats()),
    TypeOrmModule.forFeature([User, Account]),
    // BullModule.registerQueueAsync(...queues(['account'])),
    BullModule.registerQueue(...[{
      name: 'account',
    }, {
      name: 'reward'
    }]),
  ],
  controllers: [
    AppAccountsController,
    AddressController,
    AppConsultationController,
  ],
  providers: [],
})
export class AccountsModule {}
