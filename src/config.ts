import { NatsClientModuleAsyncOptions } from '@nestjs-ex/nats-strategy';
import { BullModuleAsyncOptions, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsProviderAsyncOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import * as Redis from 'ioredis';

const getBoolOrDefault = (value: string, defaultValue: boolean) =>
  value ? value === 'true' : defaultValue;

export const load = () => {
  const env = process.env;
  const port = env.WOW_PORT
    ? parseInt(env.WOW_PORT, 10)
    : env.PORT
    ? parseInt(env.PORT, 10)
    : 3000;
  const natsServers = (env.WOW_NATS_SERVERS || '192.168.1.4:4222')
    .split(',')
    .map((serv) => serv.trim());

  return {
    isProduction: env.NODE_ENV === 'production',
    port,

    nats: {
      servers: natsServers,
    },

    s3: {
      endPoint: env.WOW_S3_HOST || 's3.ap-southeast-1.amazonaws.com',
      // port: env.WOW_S3_PORT ? parseInt(env.WOW_S3_PORT, 10) : 9000,
      useSSL: getBoolOrDefault(env.WOW_S3_USE_SSL, false),
      accessKey: env.WOW_S3_ACCESS_KEY || 'testKey',
      secretKey: env.WOW_S3_SECRET_KEY || 'testSecretKey',
      region: env.WOW_S3_REGION || 'ap-southeast-1',

      defaultBucket: env.WOW_S3_DEFAULT_BUCKET || '0a7d55be',
      defaultPublicPrefix: env.WOW_S3_DEFAULT_PUBLIC_PREFIX || 'public/',
      defaultPrivatePrefix: env.WOW_S3_DEFAULT_PRIVATE_PREFIX || 'private/',
    },

    db: {
      host: env.WOW_DB_HOST || '192.168.1.4',
      port: env.WOW_DB_PORT ? parseInt(env.WOW_DB_PORT, 10) : 8529,
      username: env.WOW_DB_USER || 'dev',
      password: env.WOW_DB_PASSWORD || 'dev',
      database: env.WOW_DB_DATABASE || 'vhppdev',
    },

    redis: {
      host: env.WOW_REDIS_HOST || 'localhost',
      port: env.WOW_REDIS_PORT ? parseInt(env.WOW_REDIS_PORT, 10) : 6379,
      password: env.WOW_REDIS_PASSWORD || 'test123',
    },

    NOTIFICATION_SERVICE_GRPC: {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: join(__dirname, './protos/notification.proto'),
        url: env.WOW_NOTIFICATION_SERVICE_GRPC_URL || 'localhost:9102',

        loader: {
          longs: Number,
        },
      },
    } as ClientProvider,

    NOTIFICATION_SERVICE_NATS: {
      transport: Transport.NATS,
      options: {
        servers: natsServers,
      },
    } as ClientProvider,
  };
};

export const nats = () =>
  ({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => configService.get('nats'),
    inject: [ConfigService],
  } as NatsClientModuleAsyncOptions);

export const minio = () =>
  ({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => configService.get('s3'),
    inject: [ConfigService],
  });

export const grpcClients = (clientNames: string[]) =>
  clientNames.map(
    (clientName) =>
      ({
        name: clientName,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) =>
          configService.get<any>(clientName),
        inject: [ConfigService],
      } as ClientsProviderAsyncOptions),
  );
