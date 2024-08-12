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

  async getViewDataProducer(params: getViewDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    return new ViewDataProducer(client, params);
  }
}

class ViewDataProducer {
  private client: AchoClient;
  private assetId?: number;
  private viewId?: number;
  private pageSize?: number;
  private page?: number = 0;
  private pageTotal?: number = -1;
  constructor(client: AchoClient, params: getViewDataParams) {
    this.client = client;
    this.assetId = params.assetId;
    this.viewId = params.viewId;
    this.pageSize = params.pageSize;
  }

  async preview() {
    let page = 0;
    const data: ProjectTableDataResp = await this.client.request({
      method: 'post',
      headers: {},
      path: '/project/get-view-data',
      payload: {
        assetId: this.assetId,
        viewId: this.viewId,
        page: page,
        pageSize: this.pageSize
      }
    });
    if (!this.pageTotal || this.pageTotal < 0) {
      this.pageTotal = data?.paging?.pageTotal;
    }
    return data;
  }

  async get() {
    const resp: ProjectTableDataResp = await this.client.request({
      method: 'post',
      headers: {},
      path: '/project/get-view-data',
      payload: {
        assetId: this.assetId,
        viewId: this.viewId,
        page: this.page,
        pageSize: this.pageSize
      }
    });

    if (!this.pageTotal || this.pageTotal < 0) {
      this.pageTotal = resp?.paging?.pageTotal;
    }
    this.page = (resp?.paging?.page || 0) + 1;

    return resp.data;
  }

  async next() {
    const resp: ProjectTableDataResp = await this.client.request({
      method: 'post',
      headers: {},
      path: '/project/get-view-data',
      payload: {
        assetId: this.assetId,
        viewId: this.viewId,
        page: this.page,
        pageSize: this.pageSize
      }
    });

    if (!this.pageTotal || this.pageTotal < 0) {
      this.pageTotal = resp?.paging?.pageTotal;
    }
    this.page = (resp?.paging?.page || 0) + 1;

    return resp.data;
  }

  hasNext() {
    console.log('page', this.page, 'pageTotal', this.pageTotal);
    if (!this.pageTotal || this.pageTotal < 0) {
      return true;
    }
    console.log('page < pageTotal', (this.page || 0) < this.pageTotal);
    return (this.page || 0) < this.pageTotal;
  }
}
