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

  @Get('categories')
  async getCategories() {
    return await firstValueFrom(
      this.natsService.send('consultation.category', {}),
    );
  }

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
    const question = await firstValueFrom(
      this.natsService.send('consultation.question.create', payload),
    );
    await firstValueFrom(
      this.natsService.send('account.wallet.decrease-post-quota', {
        accountId: req.user.id,
      }),
    );

    return question;
  }

  @UseGuards(AccountGuard)
  @Get('questions/favourite')
  async paginateFavouriteList(@Request() req, @Query() query) {
    const user = req.user;
    query.accountId = user.id;
    return await firstValueFrom(
      this.natsService.send('consultation.question.favourite.paginate', query),
    );
  }

  @UseGuards(AuthGuard(['account', 'anonymous']))
  @Get('questions/:id')
  async getOneQuestion(@Param('id') id, @Request() req) {
    const user = req.user;
    return await firstValueFrom(
      this.natsService.send('consultation.question.getOne', {
        questionId: id,
        accountId: user.id || null,
      }),
    );
  }

  @UseGuards(AccountGuard)
  @Put('questions/:id')
  async updateQuestion(@Body() payload, @Param('id') id, @Request() req) {
    payload.id = id;
    payload.ownerInfo = { questionId: id, accountId: req.user.id };
    return await firstValueFrom(
      this.natsService.send('consultation.question.update', payload),
    );
  }

  @UseGuards(AccountGuard)
  @Delete('questions/:id')
  async deleteQuestion(@Param('id') id: string, @Request() req) {
    return await firstValueFrom(
      this.natsService.send('consultation.question.delete', {
        id,
        ownerInfo: { questionId: id, accountId: req.user.id },
      }),
    );
  }

  @UseGuards(AccountGuard)
  @Post('questions/:id/favourite')
  async addToFavourite(@Request() req, @Param('id') id) {
    const user = req.user;
    return await firstValueFrom(
      this.natsService.send('consultation.question.favourite.add', {
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
    payload.ownerInfo = { commentId: params.commentId, replyerId: req.user.id };

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
  @Delete('questions/:questionId/comments/:commentId/reactions')
  async deleteReaction(@Param() params, @Request() req) {
    return await firstValueFrom(
      this.natsService.send('consultation.question.comment.reaction.delete', {
        commentId: params.commentId,
        replyerId: req.user.id,
      }),
    );
  }
}
