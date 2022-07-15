import { Project, AchoClient } from '.';
import { ClientOptions } from './types';

export interface getTableDataParams {
  assetId: number;
  viewId?: number;
  page?: number;
  pageSize?: number;
}

export class ProjectEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = clientOpt;
  }
  async getViewData(params: getTableDataParams) {
    const client = new AchoClient(this.clientOpt);
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/project/get-view-data',
      payload: params
    });
    return data;
  }
}
