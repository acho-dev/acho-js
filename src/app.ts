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

export class App {
  private clientOpt: ClientOptions;
  constructor(clientOpt?: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.TOKEN
    };
  }
}
