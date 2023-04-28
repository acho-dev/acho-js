import { AchoClient } from '.';
import { ClientOptions } from './types';
import { App } from './app';
import { SERVER_ADDRESS, SOCKET_NAMESPACE } from './constants';
import { Socket, Manager } from 'socket.io-client';
import { joinAppBuilderRoom, leaveAppBuilderRoom } from './utils/sockets/appRoom';

export class AppVersion {
  public appId: string;
  public verId: string;
  public metadata: any;
  public clientOpt: ClientOptions;
  public socket?: Socket;
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
    let socManager = new Manager(SERVER_ADDRESS, {
      reconnectionAttempts: 10,
      reconnectionDelayMax: 10000,
      query: {
        token: `jwt ${this.clientOpt.apiToken}`,
        test: 'test parameter'
      }
    });
    let socket = socManager.socket(SOCKET_NAMESPACE);
    await new Promise((resolve, reject) => {
      socket
        .on('connect_error', (err) => {
          console.log('connect_error', err);
          reject(err);
        })
        .on('connect_timeout', (err) => {
          console.log('connect_timeout', err);
          reject(err);
        })
        .on('reconnect_attempt', (attempt) => {
          console.log('reconnect_attempt', attempt);
        })
        .on('connect', () => {
          console.log('connected');
          resolve('connected');
        })
        .on('error', (err) => {
          console.log('error', err);
          reject(err);
        });
    });
    this.socket = socket;
    return this.metadata;
  }

  public async join() {
    if (!this.socket) {
      throw new Error('AppVersion not initialized');
    }
    await joinAppBuilderRoom(this.socket, { app_version_id: this.verId, is_editing: true });
    return 'joined';
  }
  public async leave() {
    if (!this.socket) {
      throw new Error('AppVersion not initialized');
    }
    await leaveAppBuilderRoom(this.socket, { app_version_id: this.verId, is_editing: true });
    return 'left';
  }
  public async disconnect() {
    if (!this.socket) {
      throw new Error('AppVersion not initialized');
    }
    this.socket.disconnect();
    return 'closed';
  }
}
