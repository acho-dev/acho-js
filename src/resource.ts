import { ClientRequest } from 'http';
import {
  AchoClient,
  ActionQuery,
  ResourceTableDataResp,
  ResourceTableSchemaResp,
  ResourceDownloadResp,
  ResourceReadable
} from '.';
import { ClientOptions } from './types';
import { Readable } from 'stream';

export interface getTableDataParams {
  assetId?: number;
  resId?: number;
  target?: string; // TODO: unify param name
  page?: number;
  pageSize?: number;
}

export interface syncTableDataParams {
  resId: number;
  userId?: number;
}

export interface queryTableDataParams {
  actionQuery: ActionQuery;
  page?: number;
  pageSize?: number;
  pageToken?: string;
  jobId?: string;
}

export interface downloadTableDataParams {
  assetId?: number;
  resId?: number;
  target?: number; // TODO: unify param name
}

export interface getTableSchemaParams {
  resId?: number;
  assetId?: number;
  tableId?: string;
}

export interface createReadStreamParams {
  resId?: number;
  assetId?: number;
  tableId?: string;
  highWaterMark?: number; // in KiB
  readOptions?: Object;
  snapshotSeconds?: number;
  dataType?: 'json' | 'buffer';
}

export interface createWriteStreamParams {
  dataType: 'json' | 'csv';
  resId?: number;
  assetId?: number;
  tableId?: string;
  includeHeader?: boolean;
}

export class ResourceEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: process.env.TOKEN || clientOpt.apiToken
    };
  }

  async getTableData(params: getTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/get-data',
      payload: params
    });
    return data;
  }

  async syncTableData(params: syncTableDataParams) {
    const { userId } = params;
    const { apiToken } = this.clientOpt;
    if (!userId && apiToken) {
      const { id } = JSON.parse(Buffer.from(apiToken.split('.')[1], 'base64').toString());
      params.userId = id;
    }
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/scheduler/run-resource-update',
      payload: {
        res_id: params.resId,
        user_id: params.userId
      }
    });

    return data;
  }

  async downloadTableData(params: downloadTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceDownloadResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/download',
      payload: params
    });
    return data;
  }

  async queryTableData(params: queryTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/query',
      payload: params
    });
    return data;
  }

  async getTableSchema(params: getTableSchemaParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableSchemaResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/get-table-schema',
      payload: params
    });
    return data;
  }

  async createReadStream(params: createReadStreamParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: Readable = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/create-read-stream',
      payload: { ...params, highWaterMark: (params.highWaterMark === undefined ? 32 : params.highWaterMark) * 1024 },
      responseType: 'stream'
    });
    const readableStream: ResourceReadable = new ResourceReadable({
      // highWaterMark for streams in objectMode indicate "number of object",
      // otherwise, it means the buffer level in "number of bytes"
      highWaterMark: params.highWaterMark ? params.highWaterMark : 32,
      objectMode: true,
      read(this: ResourceReadable) {
        if (!this.isRead) {
          this.isRead = true;
          data
            .on('data', (chunk: Buffer) => {
              if (!chunk.toString().endsWith('}')) this.fragment += chunk.toString();
              else if (!chunk.toString().startsWith('{') && chunk.toString().endsWith('}')) {
                this.push(JSON.parse(this.fragment + chunk.toString()));
                this.fragment = '';
              } else {
                this.push(JSON.parse(chunk.toString()));
                // this.fragment = '';
              }
            })
            .on('error', (e: any) => {
              console.log(e);
            })
            .on('end', () => {
              this.push(null);
            });
        }
      }
    });

    readableStream.fragment = '';
    readableStream.isRead = false;

    return params.dataType === 'buffer' ? data : readableStream;
  }

  createWriteStream(params: createWriteStreamParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const httpRequest: ClientRequest = client.httpRequest({
      method: 'post',
      headers: {},
      path: `/resource/create-write-stream`
    });
    httpRequest.write(JSON.stringify({ body: params }));
    return httpRequest;
  }
}
