import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';
import { OAuthEndpoints } from './auth';
import { App } from './app';
import { BusinessObject } from './businessObject';

const defaultClientOpt = {
  apiToken: process.env.ACHO_TOKEN,
  endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
};

export default class Acho {
  private clientOpt: ClientOptions;
  public ResourceEndpoints: ResourceEndpoints;
  public ProjectEndpoints: ProjectEndpoints;
  public OAuthEndpoints: OAuthEndpoints;

  public constructor(clientOpt: ClientOptions = defaultClientOpt) {
    this.clientOpt = clientOpt;
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
    this.ProjectEndpoints = new ProjectEndpoints(clientOpt);
    this.OAuthEndpoints = new OAuthEndpoints(clientOpt);
  }

  public app(id: string, clientOpt: ClientOptions = this.clientOpt) {
    return new App(id, clientOpt);
  }

  public businessObject(bizObjClientOpt: Record<string, any>, achoClientOpt: ClientOptions = this.clientOpt) {
    return new BusinessObject(bizObjClientOpt, achoClientOpt);
  }
}

export { ResourceEndpoints, ProjectEndpoints, OAuthEndpoints, App };
