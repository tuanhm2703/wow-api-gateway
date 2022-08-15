import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountsModule } from '@wow/accounts/accounts.module';
import { env } from 'process';
import { JwtModule } from '@nestjs/jwt';
import { AccountStrategy } from './strateties/account.stratety';
import Account from '@wow/models/account.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nats } from '@wow/config';
import { NatsClientModule } from '@nestjs-ex/nats-strategy';
import { AuthController } from './auth.controller';
import { AnonymousStrategy } from './strateties/anonymous.strategy';
@Module({
  imports: [
    AccountsModule,
    PassportModule,
    NatsClientModule.registerAsync(nats()),
    JwtModule.register({
      secret: env.JWT_SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '3600s' },
    }),
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AuthController],
  providers: [AccountStrategy, AnonymousStrategy],
})
export class AuthModule {}
