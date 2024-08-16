import _ from 'lodash';
import http from 'http';
import https from 'https';
import { Readable } from 'stream';
import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions, RequestOptions } from './types';
import { read } from 'fs';

export class MediaFile {
  public achoClientOpt: ClientOptions;

  constructor(mediaFileOpt: Record<string, any>, achoClientOpt?: ClientOptions) {
    this.achoClientOpt = {
      ...achoClientOpt,
      apiToken: achoClientOpt?.apiToken || process.env.ACHO_TOKEN
    };
  }

  public async listFiles() {
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

  public async getFileReadStream(params: Record<string, any> = {}) {
    const { path } = params;
    const achoClient: AchoClient = new AchoClient(this.achoClientOpt);
    const reqConfig: RequestOptions = {
      method: 'post',
      path: '/uploaded/file/get-link',
      headers: {},
      payload: {
        file: {
          path
        }
      }
    };
    const reqResp = await achoClient.request(reqConfig);
    const fileUrl = reqResp?.url;
    console.log(`File URL: ${fileUrl}`);
    const readableStream = await downloadFileAsStream(fileUrl);
    return readableStream;
  }
}

function downloadFileAsStream(url: string) {
  return new Promise((resolve, reject) => {
    // Determine whether to use https or http based on the URL
    const protocol = url.startsWith('https') ? https : http;

    protocol
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download file. Status code: ${response.statusCode}`));
          return;
        }

        // The response is a readable stream
        resolve(response);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}
