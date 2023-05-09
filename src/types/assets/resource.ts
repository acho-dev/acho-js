import { Readable } from 'stream';

export interface ResourceHelperInfo {
  resource: Object;
  resourceTable: string;
}

// export class ResourceReadable extends Readable {
//   fragment?: string;
//   isRead?: boolean;
// }

/**
 * Resource response types
 */
export interface ResourceTableDataResp {
  data: Array<Object>;
  schema: ResourceTableSchemaResp;
  paging: {
    page: number;
    pageSize: number;
    pageTotal: number;
    pageToken?: string;
  };
  jobId?: string;
}

export interface ResourceTableSchemaResp {
  fields: Record<string, string>[];
}

// TODO: add resource:sync response type

export interface ResourceDownloadResp {
  url: string;
  archiveName: string;
}
