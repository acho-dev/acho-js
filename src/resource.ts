import { AchoClient, ActionQuery, ResourceTableDataResp, ResourceReadable } from '.';
import { ClientOptions } from './types';

export interface getTableDataParams {
  assetId?: number;
  resId?: number;
  target?: string;
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
  target?: number;
}

export interface createReadStreamParams {
  resId?: number;
  assetId?: number;
  tableId?: string;
  readOptions?: Object; // TODO: add readOptions
  snapshotSeconds?: number; // TODO: add snapshotSeconds
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
    const data = await client.request({
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

  async createReadStream(params: createReadStreamParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/create-read-stream',
      payload: params,
      responseType: 'stream'
    });
    const readableStream: ResourceReadable = new ResourceReadable({
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

    return readableStream;
  }

  async createWriteStream() {}
}
