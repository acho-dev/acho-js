import _ from 'lodash';
import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions, RequestOptions } from './types';
import EventSource from 'eventsource';
import { EventEmitter } from 'stream';

export interface createBizObjWriteStreamParams {
  tableName: string;
  maxWaitTime?: number; // in milliseconds
}

export class BusinessObject extends EventEmitter {
  public achoClientOpt: ClientOptions;
  public tableName: string;
  public moduleId?: string;
  public eventSource?: EventSource;

  constructor(bizObjOpt: Record<string, any>, achoClientOpt?: ClientOptions) {
    super();
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
      filterOptions = {},
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
        filterOptions,
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

  public async upsertRow(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/rows/upsert',
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

  public async getIndices(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/columns/get-indices',
      headers: {},
      payload: {
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
  }

  public async setIndices(keys: Array<string> = []) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/columns/set-indices',
      headers: {},
      payload: {
        columnNames: keys,
        tableName: this.tableName
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    return reqResp;
  }

  public async addIndex(key: string) {
    if (_.isNil(key)) {
      throw new Error('Missing key');
    }
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/erp/object/columns/add-index',
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

  listen(params: Record<string, any> = {}) {
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const sseUrl = `${achoClient.getBaseUrl()}/erp/object/${this.tableName}/listen`;
    const headers = {
      ...achoClient.getAuthHeader()
    };
    this.eventSource = new EventSource(sseUrl, { headers });
    this.eventSource.addEventListener('row_inserted', (event: any) => {
      console.log('row_inserted', event.data);
      try {
        const eventData = JSON.parse(event.data);
        if (!isDuplicateEvent(eventData)) {
          this.emit('row_inserted', eventData);
        }
      } catch (err) {
        console.error('Error parsing event data');
        this.emit('error', err);
      }
    });
    this.eventSource.addEventListener('row_updated', (event: any) => {
      console.log('row_updated', event.data);
      try {
        const eventData = JSON.parse(event.data);
        if (!isDuplicateEvent(eventData)) {
          this.emit('row_updated', eventData);
        }
      } catch (err) {
        console.error('Error parsing event data');
        this.emit('error', err);
      }
    });
    this.eventSource.addEventListener('row_deleted', (event: any) => {
      console.log('row_deleted', event.data);
      try {
        const eventData = JSON.parse(event.data);
        if (!isDuplicateEvent(eventData)) {
          this.emit('row_deleted', eventData);
        }
      } catch (err) {
        console.error('Error parsing event data');
        this.emit('error', err);
      }
    });
    return {
      tableName: this.tableName,
      message: 'Listening for events, use on() to listen for events',
      supportedEvents: ['row_inserted', 'row_updated', 'row_deleted']
    };
  }
}

const eventCache = new Map<string, number>(); // Declare eventCache variable
const DEDUPLICATION_INTERVAL = 10000;

function isDuplicateEvent(eventData: any) {
  const serializedEvent = serializeEvent(eventData);
  const currentTime = Date.now();
  if (eventCache.has(serializedEvent)) {
    const lastEventTime = eventCache.get(serializedEvent);
    if (lastEventTime !== undefined && currentTime - lastEventTime < DEDUPLICATION_INTERVAL) {
      return true;
    }
  }
  eventCache.set(serializedEvent, currentTime);
  return false;
}

function serializeEvent(eventData: any) {
  return JSON.stringify(eventData);
}
