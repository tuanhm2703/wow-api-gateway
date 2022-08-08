import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Account from '../../models/account.model';

@Injectable()
export class AccRepository {
  constructor(
    @InjectRepository(Account) private accountTypeormRepo: Repository<Account>,
  ) {}

  async getAccountByEmailOrPhone(username: string) {
    return await this.accountTypeormRepo
      .createQueryBuilder('account')
      .where({ email: username })
      .orWhere({ phone: username })
      .getOne();
  }
}
