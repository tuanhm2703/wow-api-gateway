import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Setting from '@wow/models/setting.model';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(Setting) private settingRepo: Repository<Setting>
  ) {}

  async findKey(key: string) {
    return await this.settingRepo.findOne({ where: { key } });
  }
}
