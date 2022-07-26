import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
      

      // // Validate the audience and the issuer.
      // // audience: configService.get('oidc').audience,
      // issuer: configService.get('oidc').issuer,
      // algorithms: ['RS256'],
    });
  }

  async validate(payload: any): Promise<any> {
    // const roles: string[] = [];
    const user = payload.ext;
    // let aud = this.configService.get('oidc').audience;

    // if (!payload['resource_access'] ||
    //   !payload['resource_access'][aud] ||
    //   !Array.isArray(payload['resource_access'][aud]['roles']))
    //   throw new UnauthorizedException('invalid roles!');

    // roles = payload['resource_access'][aud]['roles'];

    return {
      id: payload.sub,
      site: user.site,
      firstName: user.firstName,
      lastName: user.lastName,
      scope: user.scope,
      emailAddress: user.emailAddress,
      permission: user.permission,

      can: function (...permissions: number[]) {
        const allowedPermission = permissions.reduce((perm, p) => perm | p, 0);
        if (!allowedPermission) {
          return true;
        }

        // const user: any = request.user;
        const permission = atob(this.permission)
          .split('')
          .map((c) => c.charCodeAt(0));
        const byteIdx = Math.floor(allowedPermission / 8);
        const byteVal = 1 << allowedPermission % 8;

        return (permission[byteIdx] & byteVal) > 0;
      },
    };
  }
}
