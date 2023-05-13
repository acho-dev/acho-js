import { ClientRequest } from 'http';
import { AchoClient, IOAuthClient } from '.';
import { ClientOptions } from './types';

export interface IGetOAuthClientParams {
  id: string;
}

export class OAuthEndpoints {
  private clientOpt: ClientOptions;
  constructor(clientOpt: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt.apiToken || process.env.ACHO_TOKEN
    };
  }

  async identify() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: Array<IOAuthClient> = await client.request({
      method: 'get',
      headers: {},
      path: '/auth/identify'
    });
    return data;
  }

  async getOAuthClientList() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const data: Array<IOAuthClient> = await client.request({
      method: 'get',
      headers: {},
      path: '/auth/oauth/client/list'
    });
    return data;
  }

  async getOAuthToken(params: IGetOAuthClientParams) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    try {
      const data: string = await client.request({
        method: 'get',
        headers: {},
        path: `/auth/oauth/client/${params.id}/token`
      });
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
