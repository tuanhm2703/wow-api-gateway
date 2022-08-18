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

@ApiTags('consultation')
@Controller('api/v1/app/consultation')
export class AppConsultationController {
  [x: string]: any;
  constructor(private readonly natsService: NatsClient) {}

  @Get('questions')
  async paginateQuestion(@Query() query) {
    return await firstValueFrom(
      this.natsService.send('consultation.question', query),
    );
  }

  @UseGuards(AccountGuard)
  @Post('questions')
  async createQuestion(@Body() payload, @Request() req) {
    payload.accountId = req.user.id;
    return await firstValueFrom(
      this.natsService.send('consultation.question.create', payload),
    );
  }
  @UseGuards(AccountGuard)
  @Put('questions/:id')
  async updateQuestion(@Body() payload, @Param('id') id) {
    payload.id = id;
    return await firstValueFrom(
      this.natsService.send('consultation.question.update', payload),
    );
  }

  @UseGuards(AccountGuard)
  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string) {
    return await firstValueFrom(
      this.natsService.send('consultation.question.delete', { id }),
    );
  }

  @UseGuards(AccountGuard)
  @Post('questions/:id/favourite')
  async addToFavourite(@Request() req, @Param('id') id) {
    const user = req.user;
    return await firstValueFrom(
      this.natsService.send('consultation.question.favourite', {
        questionId: id,
        accountId: user.id,
      }),
    );
  }

  @UseGuards(AccountGuard)
  @Delete('questions/:id/favourite')
  async removeFromFavourite(@Request() req, @Param('id') id) {
    const user = req.user;
    return await firstValueFrom(
      this.natsService.send('consultation.question.favourite.delete', {
        questionId: id,
        accountId: user.id,
      }),
    );
  }

  @UseGuards(AuthGuard(['account', 'anonymous']))
  @Get('questions/:questionId/comments')
  async paginateComment(@Param('questionId') questionId, @Request() req) {
    const user = req.user;
    const replyerId = user == null ? null : user.id;
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment', {
        questionId,
        replyerId,
      }),
    );
  }

  @UseGuards(AccountGuard)
  @Post('questions/:questionId/comments')
  async createComment(
    @Param('questionId') questionId,
    @Body() payload,
    @Request() req,
  ) {
    payload.questionId = questionId;
    payload.replyerId = req.user.id;
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment.create', payload),
    );
  }

  @UseGuards(AccountGuard)
  @Put('questions/:questionId/comments/:commentId')
  async updateComment(@Param() params, @Body() payload, @Request() req) {
    payload.questionId = params.questionId;
    payload.replyerId = req.user.id;
    payload.id = params.commentId;
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment.update', payload),
    );
  }

  @UseGuards(AccountGuard)
  @Delete('questions/:questionId/comments/:commentId')
  async deleteComment(@Param('commentId') commentId) {
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment.delete', {
        id: commentId,
      }),
    );
  }

  @UseGuards(AccountGuard)
  @Post('questions/:questionId/comments/:commentId/reactions')
  async createReaction(@Param() params, @Body() body, @Request() req) {
    body.questionId = params.questionId;
    body.commentId = params.commentId;
    body.replyerId = req.user.id;
    return await firstValueFrom(
      this.natsService.send(
        'consultation.question.comment.reaction.create',
        body,
      ),
    );
  }

  @UseGuards(AccountGuard)
  @Delete('questions/:questionId/comments/:commentId/reactions/:reactionId')
  async deleteReaction(@Param() params) {
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment.reaction.delete', {
        id: params.reactionId,
        commentId: params.commentId,
      }),
    );
  }
}
