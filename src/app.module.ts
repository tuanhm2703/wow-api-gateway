import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import * as configs from './config';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AccountsModule } from './accounts/accounts.module';
import { MeModule } from './me/me.module';
import { AccountProcessor, RewardProcessor } from './processors';
import { AuthModule } from './auth/auth.module';
import { MediaModule } from './media/media.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configs.load],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('WOW_DB_HOST'),
        port: +configService.get('WOW_DB_PORT'),
        username: configService.get('WOW_DB_USER'),
        password: configService.get('WOW_DB_PASSWORD'),
        database: configService.get('WOW_DB_DATABASE'),
        synchronize: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('redis'),
      }),
      inject: [ConfigService],
    }),

    ClientsModule.registerAsync(
      configs.grpcClients(['NOTIFICATION_SERVICE_NATS']),
    ),

    ClientsModule.registerAsync(configs.grpcClients(['ACCOUNT_SERVICE_NATS'])),

    CoreModule.forRootAsync(),
    SharedModule,
    AccountsModule,
    MeModule,
    AuthModule,
    MediaModule,
    SettingsModule,
  ],
  controllers: [
    // PageController,
  ],
  providers: [AccountProcessor, RewardProcessor],
})
export class AppModule {}
