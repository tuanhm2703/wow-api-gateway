import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { env } from 'process';
import { AccRepository } from '../../accounts/repositories/account.repository';

@Injectable()
export class AccountStrategy extends PassportStrategy(Strategy, 'account') {
  constructor(private readonly accRepo: AccRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    const acc = await this.accRepo.getAccountByEmailOrPhone(payload.username);
    if (!acc || !acc.isActive)
      throw new UnauthorizedException('Tài khoản này chưa được kích hoạt');
    return payload;
  }
}
