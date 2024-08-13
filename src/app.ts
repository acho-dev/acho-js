import { ClientRequest } from 'http';
import { AchoClient } from '.';
import { ClientOptions } from './types';
import { AppVersion } from './version';
import axios from 'axios';
import { get } from 'lodash';

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
    if (!publishedVersion) {
      throw new Error('No published version found');
    }
    const version = await this.version(publishedVersion.id);
    return version;
  }

  public async discoverServices() {
    const client: AchoClient = new AchoClient(this.clientOpt);
    const services = await client.request({
      method: 'post',
      headers: {},
      path: `/neurons/service/discover`,
      payload: {
        appId: this.appId
      }
    });
    const { app_version_id, events: _events, builtins: _builtins, plugins: _plugins } = services;
    const builtins = _builtins.map((service: any) => {
      const getConfig = (payload: Record<string, any>) => {
        return {
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
        };
      };
      const request = (payload: Record<string, any>) => {
        return axios(getConfig(payload));
      };
      return {
        id: service._id,
        getConfig,
        request,
        class: 'builtin',
        inputSchema: service.params,
        outputSchema: service.response_schema
      };
    });
    const events = _events.map((event: any) => {
      const getConfig = (payload: Record<string, any>, options?: Record<string, any>) => {
        return {
          method: 'post',
          headers: {
            Authorization: `jwt ${this.clientOpt.apiToken}`
          },
          data: {
            scope: app_version_id,
            event: {
              type: event.type,
              payload
            },
            ...options
          },
          url: `${this.client.getBaseUrl()}/neurons/enqueue`
        };
      };
      const request = (payload: Record<string, any>, options?: Record<string, any>) => {
        return axios(getConfig(payload, options));
      };
      return {
        id: event.type,
        getConfig,
        request,
        class: 'event',
        inputSchema: event.params || {},
        outputSchema: event.response_schema || {}
      };
    });
    const plugins = _plugins.map((plugin: any) => {
      const getConfig = (payload: Record<string, any>) => {
        return {
          method: 'post',
          headers: {
            Authorization: `jwt ${this.clientOpt.apiToken}`
          },
          data: {
            _id: plugin.id,
            app_version_id,
            payload
          },
          url: `${this.client.getBaseUrl()}/neurons/dispatch-service`
        };
      };
      const request = (payload: Record<string, any>) => {
        return axios(getConfig(payload));
      };
      return {
        id: plugin.id,
        getConfig,
        request,
        class: 'plugin',
        inputSchema: plugin.parameters,
        outputSchema: plugin.responseSchema
      };
    });
    return [...builtins, ...events, ...plugins];
  }
}
