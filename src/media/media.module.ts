import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
// import { NatsClientModule } from '@nestjs-ex/nats-strategy';
// import { nats } from '../config';
import { S3Storage } from './s3.storage';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MinioModule } from 'nestjs-minio-client';
import { minio } from '@wow/config';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        ({
          storage: new S3Storage({
            privatePrefix: configService.get('s3').defaultPrivatePrefix,
            publicPrefix: configService.get('s3').defaultPublicPrefix,
            ...configService.get('s3'),
          }),
        } as MulterModuleOptions),
      inject: [ConfigService],
    }),
    MinioModule.registerAsync(minio())
    // NatsClientModule.registerAsync(nats()),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
