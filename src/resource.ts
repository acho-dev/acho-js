import { Resource, AchoClient, ActionQuery } from '.';
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

export class ResourceEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: process.env.API_TOKEN || clientOpt.apiToken
    };
  }

  async getTableData(params: getTableDataParams) {
    const client = new AchoClient(this.clientOpt);
    const data = await client.request({
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
      console.log(params);
    }
    const client = new AchoClient(this.clientOpt);
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
    const client = new AchoClient(this.clientOpt);
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/download',
      payload: params
    });
    return data;
  }

  async queryTableData(params: queryTableDataParams) {
    const client = new AchoClient(this.clientOpt);
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/query',
      payload: params
    });
  }
}
