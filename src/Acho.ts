import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';
import { OAuthEndpoints } from './auth';
import { App } from './app';

export default class Acho {
  private clientOpt: ClientOptions;
  public ResourceEndpoints: ResourceEndpoints;
  public ProjectEndpoints: ProjectEndpoints;
  public OAuthEndpoints: OAuthEndpoints;

  public constructor(clientOpt: ClientOptions) {
    this.clientOpt = clientOpt;
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
    this.ProjectEndpoints = new ProjectEndpoints(clientOpt);
    this.OAuthEndpoints = new OAuthEndpoints(clientOpt);
  }

  public app(id: string, clientOpt: ClientOptions = this.clientOpt) {
    return new App(id, clientOpt);
  }
}

export { ResourceEndpoints, ProjectEndpoints, OAuthEndpoints, App };
