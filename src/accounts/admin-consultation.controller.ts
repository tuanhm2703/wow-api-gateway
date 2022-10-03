import { firstValueFrom } from 'rxjs';
import { NatsClient } from '@nestjs-ex/nats-strategy';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountGuard } from '@wow/auth/guards/account.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('admin-consultation')
@Controller('api/v1/admin/consultation')
// @UseGuards(AuthGuard(['account']))
export class AdminConsultationController {
  [x: string]: any;
  constructor(private readonly natsService: NatsClient) {}

  @Get('questions')
  async search(@Query() query) {
    return await firstValueFrom(
      this.natsService.send('consultation.admin.questions', query),
    );
  }

  @Get('questions/:id')
  async getOneQuestion(@Param('id') id, @Request() req) {
    return await firstValueFrom(
      this.natsService.send('consultation.admin.questions.getOne', { questionId: id }),
    );
  }
}
