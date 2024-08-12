import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions } from './types';
import { AppVersion } from './version';
import axios from 'axios';

export class App {
  public client: AchoClient;
  public clientOpt: ClientOptions;
  public appId: string;
  public metadata: any;
  constructor(id: string, clientOpt?: ClientOptions) {
    this.appId = id;
    this.clientOpt = {
      ...clientOpt,
      apiToken: clientOpt?.apiToken || process.env.ACHO_TOKEN
    };
    this.client = new AchoClient(this.clientOpt);
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

  public async listVersions() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const versions = await client.request({
      method: 'get',
      headers: {},
      path: `/apps/${this.appId}/versions`
    });
    return versions;
  }

  public async getPublishedVersion() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const versions = await this.listVersions();
    const publishedVersion = versions.find((v: any) => v.status === 'published');
    const version = await this.version(publishedVersion.id);
    return version;
  }

  public async discoverServices() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const services = await client.request({
      method: 'get',
      headers: {},
      path: `/neurons/service/discover`
    });
    const { data } = services;
    const { app_version_id, headless, regular } = data;
    const requests = regular.map((service: any) => {
      const construct = (payload: Record<string, any>) => {
        return axios({
          method: 'post',
          headers: {
            Authorization: `jwt ${this.clientOpt.apiToken}`
          },
          data: {
            _id: service._id,
            app_version_id,
            payload
          },
          url: `${this.client.getBaseUrl()}/neurons/dispatch-service`
        });
      };
      return {
        id: service._id,
        construct,
        inputSchema: service.params,
        outputSchema: service.response_schema
      };
    });
    const events = headless.map((event: any) => {
      const construct = (payload: Record<string, any>) => {
        return axios({
          method: 'post',
          headers: {
            Authorization: `jwt ${this.clientOpt.apiToken}`
          },
          data: {
            scope: app_version_id,
            event: {
              type: event.type,
              payload
            }
          },
          url: `${this.client.getBaseUrl()}/neurons/enqueue`
        });
      };
      return {
        id: event.type,
        construct,
        inputSchema: event.params || {},
        outputSchema: event.response_schema || {}
      };
    });
    return { ...requests, ...events };
  }
}
