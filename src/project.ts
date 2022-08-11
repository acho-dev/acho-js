import { AchoClient, ProjectTableDataResp } from '.';
import { ClientOptions } from './types';

export interface getViewDataParams {
  assetId?: number;
  viewId?: number;
  page?: number;
  pageSize?: number;
}

export class ProjectEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = clientOpt;
  }
  async getViewData(params: getViewDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ProjectTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/project/get-view-data',
      payload: params
    });
    return data;
  }
}
