import axios, { AxiosStatic, ResponseType } from 'axios';

export interface ClientOptions {
  apiToken?: string;
  endpoint?: string;
}

export interface AuthHeader {
  Authorization: string;
}

export interface RequestOptions {
  method: 'post' | 'get';
  headers: Record<string, any>;
  path: string;
  payload?: Record<string, any>;
  responseType?: ResponseType;
}

export class AchoClient {
  private axios: AxiosStatic;
  private baseUrl: string;
  private authHeader: AuthHeader;
  constructor(clientOpt: ClientOptions) {
    this.axios = axios;
    this.baseUrl = process.env.API_ENDPOINT || clientOpt.endpoint || 'http://localhost:8888';
    this.authHeader = { Authorization: `jwt ${process.env.TOKEN || clientOpt.apiToken}` };
  }
  async request(options: RequestOptions) {
    const { method, headers, path, payload, responseType } = options;
    const url = this.baseUrl + path;
    const config = {
      method,
      url,
      responseType,
      headers: {
        ...headers,
        ...this.authHeader
      },
      data: payload
    };
    const response = await this.axios(config);
    const { data } = response;
    return data;
  }
}
