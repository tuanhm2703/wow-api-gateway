import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountsModule } from '@wow/accounts/accounts.module';
import { env } from 'process';
import { JwtModule } from '@nestjs/jwt';
import { AccountStrategy } from './strateties/account.stratety';

@Module({
  imports: [
    AccountsModule,
    PassportModule,
    JwtModule.register({
      secret: env.JWT_SECRET_KEY || 'secretKey',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [AccountStrategy],
})
export class AuthModule {}
