import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NatsClientModule } from '@nestjs-ex/nats-strategy';
import { MeController } from './me.controller';
import { nats } from '../config';

@Module({
  imports: [
    NatsClientModule.registerAsync(nats()),
    // BullModule.registerQueueAsync(...queues(['account'])),
    BullModule.registerQueue({
      name: 'account'
    }),
  ],
  controllers: [MeController],
})
export class MeModule {}
