import { AchoClient, ActionQuery, ProjectTableDataResp } from '.';
import { ClientOptions } from './types';

export interface getViewDataParams {
  assetId?: number;
  viewId?: number;
  page?: number;
  pageSize?: number;
}

export interface queryTableDataParams {
  actionQuery: ActionQuery;
  page?: number;
  pageSize?: number;
  pageToken?: string;
  jobId?: string;
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

  /**
   * Query resource table data
   * @param {queryTableDataParams} params
   * @param {ActionQuery} params.actionQuery - (required) the query and the helper info to query a resource table
   * @param {number} params.page - the page of paged data
   * @param {pageSize} params.pageSize - how many rows should be in one data page
   * @param {string} params.jobId - required if you want to query other pages with the same actionQuery
   * @returns {ProjectTableDataResp}
   */
  async queryTableData(params: queryTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ProjectTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/project/query',
      payload: params
    });
    return data;
  }
}
