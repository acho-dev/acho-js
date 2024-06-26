import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions } from './types';
import { OAuthEndpoints } from './auth';

interface AppUserOptions {
  filter?: Record<string, any>;
  sort?: Record<string, any>;
  paginator?: {
    pageSize: number;
    currentPage: number;
  };
  search?: {
    keyword: string;
  };
}

export class AppUsers {
  public clientOpt: ClientOptions;
  public metadata: any;
  constructor(clientOpt?: ClientOptions) {
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.ACHO_TOKEN
    };
  }

  public async init() {
    const authClient = new OAuthEndpoints(this.clientOpt);
    const identity = await authClient.identify();
    this.metadata = { identity };
    return { message: 'App User Endpoints initialized', identity };
  }

  public async retrieve(appUserOptions: AppUserOptions = {}) {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const appUsers = await client.request({
      method: 'post',
      headers: {},
      path: '/apps/users/by-team',
      payload: appUserOptions
    });
    return appUsers;
  }
}
