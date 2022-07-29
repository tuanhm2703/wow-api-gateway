export interface S3File extends Partial<Express.Multer.File> {
  id: string;
  etag: string;
  fileName: string;
  originalName: string;
  ext: string;
  mimeType: string;
  fileSize: number;
  caption: string;
  position: number;
  metaData: any;
  bucket: string;
  prefix: string;
  private: boolean;
}
