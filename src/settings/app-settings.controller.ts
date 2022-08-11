import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SettingService } from './setting.service';

@ApiTags('setting')
@Controller('api/v1/app/settings')
export class AppSettingsController {
  constructor(
    private readonly settingService: SettingService,
  ) {}

  @Get(':key')
  @HttpCode(HttpStatus.OK)
  async getGeneralProfileAccount(@Param('key') key: string) {
    try {
      const data = await this.settingService.findKey(key);
      return data;
    } catch (error) {
      return error;
    }
  }
}
