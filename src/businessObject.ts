import _ from 'lodash';

import { AchoClient } from '.';
import { ClientOptions, RequestOptions } from './types';

export class BusinessObject {
  public achoClientOpt: ClientOptions;
  public tableName: string;

  constructor(bizObjOpt: Record<string, any>, achoClientOpt?: ClientOptions) {
    this.achoClientOpt = {
      ...achoClientOpt,
      apiToken: achoClientOpt?.apiToken || process.env.ACHO_TOKEN
    };

    if (_.isNil(bizObjOpt?.tableName)) {
      throw new Error('Missing table name');
    }
    this.tableName = bizObjOpt.tableName;
  }

  public async getObject(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/get',
      headers: {},
      payload: {
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);

    return reqResp;
  }

  public async getData(params: Record<string, any> = {}) {
    const {
      columnOptions = { includeCtid: true },
      pageOptions = { pageNumber: 1, pageSize: 100 },
      searchOptions = {},
      sortOptions = [{ expr: 'ctid', exprOrder: 'desc', nullOrder: 'last' }]
    } = params;

    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/data/get',
      headers: {},
      payload: {
        tableName: this.tableName,
        columnOptions,
        pageOptions,
        searchOptions,
        sortOptions
      }
    };
    const reqResp = await achoClient.request(reqConfig);

    return reqResp;
  }

  public async addRow(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/rows/add',
      headers: {},
      payload: {
        ...params,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);

    return reqResp;
  }

  public async updateRow(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/rows/update',
      headers: {},
      payload: {
        ...params,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);

    return reqResp;
  }

  public async deleteRow(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/rows/delete',
      headers: {},
      payload: {
        ...params,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);

    return reqResp;
  }
}
