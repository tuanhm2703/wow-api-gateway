// import { NatsClient } from '@nestjs-ex/nats-strategy';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetPresignedUrlRequest } from './dto/get-presigned-url-request.dto';
// import { ApiConsumes, ApiTags } from '@nestjs/swagger';
// import { ListResponse } from '@vhpp-webapi/interfaces';
// import { GetListMediaRequest } from './dto/get-list-media-request.dto';
import { MediaMsg, MediaUploadSingleRequest } from './media.interface';
import { MediaService } from './media.service';
import { S3File } from './s3.interface';

// @ApiTags('media')
@Controller('api/v1/app/media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService
  ) {}

  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  // @ApiConsumes('multipart/form-data')
  async uploadSingle(
    //@Req() req,
    @UploadedFile() file: S3File,
    @Body() { collection, name }: MediaUploadSingleRequest,
  ) {
    const mediaMsg: MediaMsg = {
      id: file.id,
      // etag: file.etag,
      name: name || '',
      fileName: file.fileName,
      originalName: file.originalName,
      ext: file.ext,
      mimeType: file.mimeType,
      fileSize: file.fileSize,
      caption: file.caption,
      position: file.position,
      metaData: JSON.stringify(file.metaData),
      bucket: file.bucket,
      prefix: file.prefix,
      // path: file.path,
      private: file.private,
      collection,
    };

    // const media: MediaMsg = await this.natsService.send('media.putFile', mediaMsg).toPromise();

    if (!file.private) {
      // media.url = `/${media.bucket}/${media.prefix}${media.fileName}${media.ext}`;
      mediaMsg.url = `/${mediaMsg.bucket}/${mediaMsg.prefix}${mediaMsg.fileName}${mediaMsg.ext}`;
    }

    return {
      data: mediaMsg,
    };
  }

  @Get('presigned-url')
  async generatePresignedUrl(
    @Query() { key, bucket }: GetPresignedUrlRequest
  ) {
    const presignedUrl = await this.mediaService.generatePresignedUrl(key, bucket);
    return { data: presignedUrl }
  }
}
