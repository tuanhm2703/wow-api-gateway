import { NatsClientModule } from '@nestjs-ex/nats-strategy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nats } from '../config';
import { AppSettingsController } from './app-settings.controller';
import Setting from '@wow/models/setting.model';
import { SettingService } from './setting.service';

@Module({
  imports: [
    NatsClientModule.registerAsync(nats()),
    TypeOrmModule.forFeature([Setting]),
  ],
  controllers: [AppSettingsController],
  providers: [SettingService],
})
export class SettingsModule {}
