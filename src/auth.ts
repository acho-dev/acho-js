import { ClientRequest } from 'http';
import { AchoClient, IOAuthClient } from '.';
import { ClientOptions } from './types';

export interface IGetOAuthClientParams {
  id: string;
}

export class OAuthEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt.apiToken || process.env.TOKEN
    };
  }

  /**
   * Query resource table data
   * @param {queryTableDataParams} params
   * @param {ActionQuery} params.actionQuery - (required) the query and the helper info to query a resource table
   * @param {number} params.page - the page of paged data
   * @param {pageSize} params.pageSize - how many rows should be in one data page
   * @param {string} params.jobId - required if you want to query other pages with the same actionQuery
   * @returns {ResourceTableDataResp}
   */
  async getOAuthClientList() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: Array<IOAuthClient> = await client.request({
      method: 'get',
      headers: {},
      path: '/auth/oauth/client/list'
    });
    return data;
  }

  async getOAuthClient(params: IGetOAuthClientParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: IOAuthClient = await client.request({
      method: 'get',
      headers: {},
      path: `/auth/oauth/client/${params.id}/token`,
      payload: params
    });
    return data;
  }
}
