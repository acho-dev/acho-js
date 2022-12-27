import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';
import { OAuthEndpoints } from './auth';

export default class Acho {
  public ResourceEndpoints: ResourceEndpoints;
  public ProjectEndpoints: ProjectEndpoints;
  public OAuthEndpoints: OAuthEndpoints;

  public constructor(clientOpt: ClientOptions) {
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
    this.ProjectEndpoints = new ProjectEndpoints(clientOpt);
    this.OAuthEndpoints = new OAuthEndpoints(clientOpt);
  }
}

export { ResourceEndpoints, ProjectEndpoints, OAuthEndpoints };
