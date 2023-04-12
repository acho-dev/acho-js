import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';
import { OAuthEndpoints } from './auth';
import { App } from './app';

export default class Acho {
  public ResourceEndpoints: ResourceEndpoints;
  public ProjectEndpoints: ProjectEndpoints;
  public OAuthEndpoints: OAuthEndpoints;
  public App: App;

  public constructor(clientOpt: ClientOptions) {
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
    this.ProjectEndpoints = new ProjectEndpoints(clientOpt);
    this.OAuthEndpoints = new OAuthEndpoints(clientOpt);
    this.App = new App(clientOpt);
  }
}

export { ResourceEndpoints, ProjectEndpoints, OAuthEndpoints, App };
