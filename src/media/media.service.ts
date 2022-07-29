import { Endpoint, S3 } from 'aws-sdk';
import { S3Client } from "@aws-sdk/client-s3";
import { Logger, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { config } from 'process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    private readonly minio: MinioService,
    private configService: ConfigService
  ) { }

  async generatePresignedUrl(key: string, bucket?: string) {
    const defaultBucket = this.configService.get('s3.defaultBucket');
    return await this.minio.client.presignedPutObject(bucket || defaultBucket, key);
  }
}
