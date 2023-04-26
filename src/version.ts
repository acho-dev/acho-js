import { AchoClient } from '.';
import { ClientOptions } from './types';
import { App } from './app';
import { SERVER_ADDRESS, SOCKET_NAMESPACE } from './constants';
import { Socket, io } from 'socket.io-client';

export class AppVersion {
  public appId: string;
  public verId: string;
  public metadata: any;
  public clientOpt: ClientOptions;
  public room?: Socket;
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
    this.room = io(SERVER_ADDRESS + SOCKET_NAMESPACE, {
      reconnectionAttempts: 10,
      query: {
        token: this.clientOpt.apiToken,
        test: 'test parameter'
      }
    });
    return this.metadata;
  }
}
