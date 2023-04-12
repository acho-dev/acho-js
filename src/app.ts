import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions } from './types';

export class App {
  private clientOpt: ClientOptions;
  private id: string;
  private metadata: any;
  constructor(id: string, clientOpt?: ClientOptions) {
    this.id = id;
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.TOKEN
    };
  }

  public async init() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const appObj = await client.request({
      method: 'get',
      headers: {},
      path: `/apps/${this.id}`
    });
    this.metadata = appObj;
    return this.metadata;
  }
}
