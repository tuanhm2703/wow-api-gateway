import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './services';

@Module({
  imports: [ConfigModule],
  providers: [JwtStrategy],
  // exports: [
  //   JwtStrategy
  // ]
})
export class CoreModule {
  static forRootAsync(): DynamicModule {
    return {
      module: CoreModule,
      imports: [ConfigModule],
      providers: [
        // {
        //   provide: NATS_CLIENT,
        //   useFactory: async (configService: ConfigService) => {
        //     const natsOpts = configService.get('nats');
        //     const client = await nats.connect({
        //       servers: (natsOpts.servers as string).split(',').map((serv) => serv.trim())
        //     });
        //     return client;
        //   },
        //   inject: [ConfigService]
        // }
      ],
    };
  }
}
