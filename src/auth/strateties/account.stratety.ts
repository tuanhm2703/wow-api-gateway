import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AccountStrategy extends PassportStrategy(Strategy, 'account') {
  constructor(private readonly natsService: NatsClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    try {
      const acc = await firstValueFrom(
        this.natsService.send('account.profile.general', payload),
      );
      if (!acc || !acc.isActive)
        throw new UnauthorizedException('Tài khoản này chưa được kích hoạt');
      return payload;
    } catch (error) {
      if (error.statusCode === 404)
        throw new UnauthorizedException(error.message);
    }
  }
}
