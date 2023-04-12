import { AchoClient } from '.';
import { ClientOptions } from './types';
import { App } from './app';

export class AppVersion {
  public appId: string;
  public verId: string;
  public metadata: any;
  public clientOpt: ClientOptions;
  constructor(appId: string, verId: string, clientOpt?: ClientOptions) {
    this.appId = appId;
    this.verId = verId;
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.TOKEN
    };
  }

  public async init() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const verObj = await client.request({
      method: 'get',
      headers: {},
      path: `/apps/${this.appId}/versions/${this.verId}`
    });
    this.metadata = verObj;
    return this.metadata;
  }
}
