import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

interface Closable {
  close(): Promise<void>;
}

const closables: Closable[] = [];
const gracefullHandler = async () => {
  console.log('Shutting down...');
  for (const closable of closables) {
    await closable.close();
  }
  process.exit(1);
};

process.on('SIGINT', gracefullHandler);
process.on('SIGTERM', gracefullHandler);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = +configService.get<number>('port', 3000);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
  });

  closables.push(app);
  await app.listen(port);
}
bootstrap();
