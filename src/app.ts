import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions } from './types';
import { AppVersion } from './version';

export class App {
  public clientOpt: ClientOptions;
  public appId: string;
  public metadata: any;
  constructor(id: string, clientOpt?: ClientOptions) {
    this.appId = id;
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.ACHO_TOKEN
    };
  }

  public async init() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const appObj = await client.request({
      method: 'get',
      headers: {},
      path: `/apps/${this.appId}`
    });
    this.metadata = appObj;
    return this.metadata;
  }

  public async version(id: string) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const version = new AppVersion(this.appId, id, this.clientOpt);
    await version.init();
    return version;
  }
}
