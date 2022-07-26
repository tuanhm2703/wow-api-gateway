import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const isOk = await (super.canActivate(context) as Promise<boolean>);

    if (!isOk) return isOk;

    const allowedPerms: number[] = this.reflector.get<number[]>('permission', context.getHandler());

    if (!allowedPerms) {
      return true;
    }

    // https://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string
    const user: any = request.user;
    const userPerms = atob(user.permission)
      .split('')
      .map((c) => c.charCodeAt(0));

    return this.able(allowedPerms, userPerms);
  }

  private able(allowedPerms: number[], userPerms: number[]) {
    for (const perm of allowedPerms) {
      if (this.hasPermission(userPerms, perm)) {
        return true;
      }
    }

    return false;
  }

  private hasPermission(userPerms: number[], allowedPerm: number) {
    const byteIdx = Math.floor(allowedPerm / 8);
    const byteVal = 1 << allowedPerm % 8;
    return (userPerms[byteIdx] & byteVal) > 0;
  }

  // handleRequest(err, user, info) {
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}
