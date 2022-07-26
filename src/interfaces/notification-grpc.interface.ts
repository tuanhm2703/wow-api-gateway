import { Observable } from 'rxjs';

export interface SendForgetPwdReq {
  email: string;
  resetLink: string;
}

export interface SendVerifyEmailReq {
  url: string;
  emailAddress: string;
  username: string;
  lang: string;
}

export interface NotificationGrpcService {
  sendForgetPwd(req: SendForgetPwdReq): Observable<any>;
  sendVerifyEmail(req: SendVerifyEmailReq): Observable<any>;
}
