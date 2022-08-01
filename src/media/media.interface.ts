// import { ApiProperty } from '@nestjs/swagger';
// import { ListResponse } from '@vhpp-webapi/interfaces';
import { Observable } from 'rxjs';

export interface MediaMsg {
  id: string;
  name: string;
  fileName: string;
  originalName: string;
  ext: string;
  mimeType: string;
  fileSize: number;
  caption: string;
  position: number;
  metaData: string;
  bucket: string;
  prefix: string;
  private: boolean;
  url?: string;
  collection?: string;
}

export interface MediaQuery {
  pageNumber: number;
  itemsPerPage: number;
  collection?: string;
}

export class MediaUploadSingleRequest {
  // @ApiProperty()
  collection: string;

  // @ApiProperty({ required: false })
  name: string;

  // @ApiProperty({ type: 'file' })
  file: any;
}

// export interface MediaGrpcService {
//   putFile(media: MediaMsg): Observable<MediaMsg>;
//   getFiles(query: MediaQuery): Observable<ListResponse<MediaMsg>>;
//   deleteFile(query: DeleteMediaQuery): Observable<DeleteMediaResponse>;
//   convertHtml(query: ConvertHtmlQuery): Observable<MediaMsg>;
// }

export interface ConvertHtmlQuery {
  content: string;
}

export interface DeleteMediaQuery {
  id: string;
}

export interface DeleteMediaResponse {
  success: boolean;
  message?: string;
}

export interface ListMediaResponse {
  data: MediaMsg[];
  totalItems: number;
  pageNumber: number;
  itemsPerPage: number;
}
