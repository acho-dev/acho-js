import _ from 'lodash';
import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions, RequestOptions } from './types';

export interface createBizObjWriteStreamParams {
  tableName: string;
  maxWaitTime?: number; // in milliseconds
}

export class BusinessObject {
  public achoClientOpt: ClientOptions;
  public tableName: string;
  public moduleId?: string;

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

  public setModuleId(moduleId: string) {
    this.moduleId = moduleId;
  }

  public async listModules() {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/module/list',
      headers: {},
      payload: {}
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
  }

  public async createObject(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/install',
      headers: {},
      payload: {
        moduleId: this.moduleId,
        tableName: this.tableName,
        tableDisplayName: this.tableName,
        tableColumns: {}
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
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
      sortOptions = [{ expr: 'ctid', exprOrder: 'desc', nullOrder: 'last' }],
      filterOptions = {}
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
        sortOptions,
        filterOptions
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

  public async getRowByAchoID(acho_id: string){
    const result = await this.getData({
      filterOptions: {
        type: "logical",
        operator: "and",
        operands: [
          {
            type: "comparison",
            operator: "stringEqualTo",
            leftOperand: "_acho_id",
            rightOperand: acho_id,
          },
        ],
      },
    });
  
    if (!result.data) return null;
  
    return result.data[0];
  }

  public async updateRowByAchoID(acho_id: string, params: Record<string, any> = {}){
    const result = await this.updateRow({...params, "achoId": acho_id});

    if (!result){
      return null;
    }

    return result[0];
  }

  public async deleteRowByAchoID(acho_id: string){
    return this.deleteRow({"achoId": acho_id});
  }

  public async getPrimaryKeys(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/get-primary-keys',
      headers: {},
      payload: {
        tableName: this.tableName
      }
    };
  }

  public async setPrimaryKeys(keys: Array<string> = []) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/set-primary-keys',
      headers: {},
      payload: {
        columnNames: keys,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
  }

  public async addPrimaryKey(key: string) {
    if (_.isNil(key)) {
      throw new Error('Missing key');
    }
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/add-primary-key',
      headers: {},
      payload: {
        columnName: key,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
  }

  createWriteStream(options: any) {
    const client: AchoClient = new AchoClient(this.achoClientOpt);
    const httpRequest: ClientRequest = client.httpRequest({
      method: 'post',
      headers: {},
      path: `/erp/object/create-write-stream`
    });
    httpRequest.write(JSON.stringify({ body: { tableName: this.tableName, options } }));
    return httpRequest;
  }
}
