import { Resource, AchoClient } from '.';
import { ClientOptions } from './types';

export interface getTableDataParams {
  assetId: number;
  resId?: number;
  target?: string;
  paging?: {
    pageSize: number;
    page: number;
  };
}

export class ResourceEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = clientOpt;
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
}
