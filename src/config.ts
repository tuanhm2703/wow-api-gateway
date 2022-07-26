import { NatsClientModuleAsyncOptions } from '@nestjs-ex/nats-strategy';
import { BullModuleAsyncOptions, BullModuleOptions } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsProviderAsyncOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as Redis from 'ioredis';

const getBoolOrDefault = (value: string, defaultValue: boolean) => (value ? value === 'true' : defaultValue);

export const load = () => {
  const env = process.env;
  const port = env.WOW_PORT ? parseInt(env.WOW_PORT, 10) : (
    env.PORT ? parseInt(env.PORT, 10) : 3000
  );
  const natsServers = (env.WOW_NATS_SERVERS || '192.168.1.4:4222').split(',').map((serv) => serv.trim());

  return {
    isProduction: env.NODE_ENV === 'production',
    port,

    nats: {
      servers: natsServers,
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

export const grpcClients = (clientNames: string[]) =>
  clientNames.map(
    (clientName) =>
      ({
        name: clientName,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => configService.get<any>(clientName),
        inject: [ConfigService],
      } as ClientsProviderAsyncOptions),
  );