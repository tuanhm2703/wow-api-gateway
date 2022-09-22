import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserStratety extends PassportStrategy(Strategy, 'user') {
  constructor(private readonly natsService: NatsClient) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const user = await firstValueFrom(
      this.natsService.send('admin.user.getOne', payload.username),
    );
    if (!user || !user.isActive)
      throw new UnauthorizedException('Tài khoản này chưa được kích hoạt');
    return payload;
  }
}
