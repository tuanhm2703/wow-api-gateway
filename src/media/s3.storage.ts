import { Request } from 'express';
import { StorageEngine } from 'multer';
import * as Minio from 'minio';
import * as mime from 'mime';
import * as dayjs from 'dayjs';
import { posix as path } from 'path';
import * as crypto from 'crypto';
import { Stream } from 'stream';
import { S3File } from './s3.interface';

export interface S3Options extends Minio.ClientOptions {
  defaultBucket?: string;
}

export interface S3StorageOptions extends S3Options {
  publicPrefix: string;
  privatePrefix: string;
}

export class S3Factory {
  private static _instance: S3Factory;

  private _minioClient: Minio.Client;
  private _region = 'us-east-1';
  private _defaultBucket = 'mtweb';

  constructor(options: S3Options) {
    this._minioClient = new Minio.Client({
      endPoint: options.endPoint,
      port: options.port,
      useSSL: options.useSSL,
      accessKey: options.accessKey,
      secretKey: options.secretKey,
      region: options.region,
    });

    if (options.region) this._region = options.region;
    if (options.defaultBucket) this._defaultBucket = options.defaultBucket;
  }

  async upload(file: Express.Multer.File, prefix: string): Promise<S3File> {
    const { fileName, ext } = await this.genFilename(file.originalname);
    const newFilename = fileName + ext;
    let fileSize = 0;

    file.stream.on('data', (chunk) => {
      fileSize += chunk.length;
    });

    const objectName = prefix + newFilename;
    const mimeStr = mime.getType(file.originalname);
    const metaData: Minio.ItemBucketMetadata = mimeStr
      ? {
          'Content-Type': mimeStr,
        }
      : undefined;
    const etag = await this._minioClient.putObject(this._defaultBucket, objectName, file.stream, metaData);

    return {
      // Media fields
      id: fileName,
      etag: 'etag',
      fileName,
      originalName: file.originalname,
      ext,
      mimeType: mimeStr,
      fileSize,
      caption: '',
      position: 0,
      metaData: {},
      bucket: this._defaultBucket,
      prefix: prefix,
      path: objectName,
      private: false,
      // File fields
      // filename: newFilename, //  `DiskStorage` only
      size: fileSize,
    };
  }

  async download(bucket: string, object: string): Promise<Stream> {
    return await this._minioClient.getObject(bucket, object);
  }

  private async genFilename(originalname: string) {
    const ext = path.extname(originalname).toLowerCase();

    return await new Promise<any>((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            fileName: buf.toString('hex'),
            ext,
          });
        }
      });
    });
  }

  static instance(options?: S3Options) {
    return this._instance || (this._instance = new this(options));
  }
}

export class S3Storage implements StorageEngine {
  private _s3Factory: S3Factory;
  private _publicPrefix: string;
  private _privatePrefix: string;

  constructor(options: S3StorageOptions) {
    this._s3Factory = S3Factory.instance(options);
    this._publicPrefix = options.publicPrefix;
    this._privatePrefix = options.privatePrefix;
  }

  _handleFile(req: Request, file: Express.Multer.File, callback: (error?: any, info?: S3File) => void): void {
    let prefix = this._publicPrefix;

    if (req.body.private) {
      prefix = this._privatePrefix;
    }

    prefix += dayjs().format('YYYY-MM-DD') + '/';

    this._s3Factory
      .upload(file, prefix)
      .then((file: S3File) => {
        file.private = !!req.body.private;
        return callback(null, file);
      })
      .catch((err) => callback(err));
  }

  _removeFile(req: Request, file: Express.Multer.File, callback: (error: Error) => void): void {
    // this._s3Factory.
    callback(null);
  }
}
