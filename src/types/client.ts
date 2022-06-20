import axios, { AxiosStatic } from 'axios';

export interface ClientOptions {
  apiToken?: string;
  endpoint: string;
}

export interface AuthHeader {
  Authorization: string;
}

export interface RequestOptions {
  method: 'post' | 'get';
  headers: Record<string, any>;
  path: string;
  payload?: Record<string, any>;
}

export class AchoClient {
  private axios: AxiosStatic;
  private baseUrl: string;
  private authHeader: AuthHeader;
  constructor(clientOpt: ClientOptions) {
    this.axios = axios;
    this.baseUrl = clientOpt.endpoint;
    this.authHeader = { Authorization: `jwt ${clientOpt.apiToken}` };
  }
  async request(options: RequestOptions) {
    const url = this.baseUrl + options.path;
    const config = {
      method: options.method,
      url,
      headers: {
        ...options.headers,
        ...this.authHeader
      },
      data: options.payload
    };
    const response = await this.axios(config);
    const { data } = response;
    return data;
  }
}
