import { Resource, AchoClient } from '.';

export interface getTableDataParams {
  assetId: number;
  resId?: number;
  target?: string;
  pageSize?: number;
  page: number;
}

export class ResourceEndpoints {
  constructor() {}
  async getTableData(params: getTableDataParams) {
    const client = new AchoClient({ apiToken: process.env.API_TOKEN, endpoint: process.env.API_ENDPOINT! });
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/get-data',
      payload: params
    });
    return data;
  }
}
