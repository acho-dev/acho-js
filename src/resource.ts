import { ClientRequest } from 'http';
import {
  AchoClient,
  ActionQuery,
  ResourceTableDataResp,
  ResourceTableSchemaResp,
  ResourceDownloadResp,
  ResourceReadable
} from '.';
import { ClientOptions } from './types';
import { Readable } from 'stream';
import createError from 'http-errors';

export interface getTableDataParams {
  assetId?: number;
  resId?: number;
  tableId?: string;
  page?: number;
  pageSize?: number;
}

export interface syncTableDataParams {
  resId: number;
  userId?: number;
}

export interface queryTableDataParams {
  actionQuery: ActionQuery;
  page?: number;
  pageSize?: number;
  pageToken?: string;
  jobId?: string;
}

export interface downloadTableDataParams {
  assetId?: number;
  resId?: number;
  tableId?: number;
}

export interface getTableSchemaParams {
  resId?: number;
  assetId?: number;
  tableId?: string;
}

export interface createReadStreamParams {
  resId?: number;
  assetId?: number;
  tableId?: string;
  highWaterMark?: number; // in KiB
  readOptions?: Object;
  snapshotSeconds?: number;
  dataType?: 'json' | 'buffer';
}

export interface createWriteStreamParams {
  dataType: 'json' | 'csv';
  resId?: number;
  assetId?: number;
  tableId?: string;
  hasHeader?: boolean;
  maxWaitTime?: number; // in milliseconds
}

export class ResourceEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt.apiToken || process.env.TOKEN
    };
  }

  /**
   * Get resource table by page
   * @param {getTableDataParams} params
   * @param {number} params.assetId - either provide a assetId or a resId
   * @param {number} params.resId - either provide a assetId or a resId
   * @param {string} params.tableId - when the resource is of type "integration", a tableId is required
   * @param {number} params.page - the page of paged data
   * @param {pageSize} params.pageSize - how many rows should be in one data page
   * @returns {ResourceTableDataResp}
   */
  async getTableData(params: getTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/get-data',
      payload: params
    });
    return data;
  }

  /**
   * Sync resource data
   * @param {syncTableDataParams} params
   * @returns {}
   */
  async syncTableData(params: syncTableDataParams) {
    const { userId } = params;
    const { apiToken } = this.clientOpt;
    if (!userId && apiToken) {
      const { id } = JSON.parse(Buffer.from(apiToken.split('.')[1], 'base64').toString());
      params.userId = id;
    }
    const client: AchoClient = new AchoClient(this.clientOpt);
    // TODO: add response type
    const data = await client.request({
      method: 'post',
      headers: {},
      path: '/scheduler/run-resource-update',
      payload: {
        res_id: params.resId,
        user_id: params.userId
      }
    });

    return data;
  }

  /**
   * Download resource table data
   * @param {downloadTableDataParams} params
   * @returns {ResourceTableDataResp}
   */
  async downloadTableData(params: downloadTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceDownloadResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/download',
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
   * @returns {ResourceTableDataResp}
   */
  async queryTableData(params: queryTableDataParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableDataResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/query',
      payload: params
    });
    return data;
  }

  /**
   * Get the resource table schema
   * @param {getTableSchemaParams} params
   * @param {number} params.assetId - either provide a assetId or a resId
   * @param {number} params.resId - either provide a assetId or a resId
   * @param {string} params.tableId - when the resource is of type "integration", a tableId is required
   * @returns {ResourceTableSchemaResp}
   */
  async getTableSchema(params: getTableSchemaParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: ResourceTableSchemaResp = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/get-table-schema',
      payload: params
    });
    return data;
  }

  /**
   * Create a readable stream to read data from a resource table
   * @param {createReadStreamParams} params
   * @param {number} params.assetId - either provide a assetId or a resId
   * @param {number} params.resId - either provide a assetId or a resId
   * @param {string} params.tableId - when the resource is of type "integration", a tableId is required
   * @param {number} params.highWaterMark - in KiB, default to 16384 KiB or 16 objects if the stream is in object mode
   * @param {Object} params.readOptions - https://googleapis.dev/nodejs/bigquerystorage/2.7.0/google.cloud.bigquery.storage.v1.ReadSession.ITableReadOptions.html
   * @param {number} params.snapshotSeconds - https://googleapis.dev/nodejs/bigquerystorage/2.7.0/google.cloud.bigquery.storage.v1.ReadSession.ITableModifiers.html
   * @param {dataType} params.dataType - when set to json, the data streamed from the returned readable stream is of JSON type, otherwise, buffer
   * @returns
   */
  async createReadStream(params: createReadStreamParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: Readable = await client.request({
      method: 'post',
      headers: {},
      path: '/resource/create-read-stream',
      payload: { ...params, highWaterMark: (params.highWaterMark === undefined ? 32 : params.highWaterMark) * 1024 },
      responseType: 'stream'
    });
    const readableStream: ResourceReadable = new ResourceReadable({
      // highWaterMark for streams in objectMode indicate "number of object",
      // otherwise, it means the buffer level in "number of bytes"
      highWaterMark: params.highWaterMark ? params.highWaterMark : 32,
      objectMode: true,
      read(this: ResourceReadable) {
        if (!this.isRead) {
          this.isRead = true;
          data
            .on('data', (chunk: Buffer) => {
              if (!chunk.toString().endsWith('}')) this.fragment += chunk.toString();
              else if (!chunk.toString().startsWith('{') && chunk.toString().endsWith('}')) {
                this.push(JSON.parse(this.fragment + chunk.toString()));
                this.fragment = '';
              } else {
                this.push(JSON.parse(chunk.toString()));
                // this.fragment = '';
              }
            })
            .on('error', (e: any) => {
              console.log(e);
            })
            .on('end', () => {
              this.push(null);
            });
        }
      }
    });

    readableStream.fragment = '';
    readableStream.isRead = false;

    return params.dataType === 'buffer' ? data : readableStream;
  }

  /**
   * Create a writable stream to write data to a resource table
   * @param params
   * @param {string} params.dataType - specify the input data type, json or csv
   * @param {number} params.assetId - either provide a assetId or a resId
   * @param {number} params.resId - either provide a assetId or a resId
   * @param {string} params.tableId - when the resource is of type "integration", a tableId is required
   * @param {string} params.hasHeader - indicate whether the input csv data includes the header
   * @param {number} params.maxWaitTime - the maximum time in milliseconds to wait from the write job to complete, default to 60000 milliseconds
   * @returns
   */
  createWriteStream(params: createWriteStreamParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const httpRequest: ClientRequest = client.httpRequest({
      method: 'post',
      headers: {},
      path: `/resource/create-write-stream`
    });
    httpRequest.write(JSON.stringify({ body: params }));
    // httpRequest.once('response', (resp) => {
    //   if (resp?.statusCode) {
    //     if (resp.statusCode >= 400) {
    //       if (resp.statusCode === 401) {
    //         httpRequest.emit('error', createError(resp.statusCode, 'Unauthorized'));
    //       } else if (resp.statusCode === 403) {
    //         httpRequest.emit('error', createError(resp.statusCode, 'Access denied'));
    //       } else {
    //         httpRequest.emit('error', createError(resp.statusCode, 'Error'));
    //       }
    //     }
    //   } else {
    //     httpRequest.emit('error', Error('Unknown'));
    //   }
    // });
    return httpRequest;
  }
}
