import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';

export default class Acho {
  public ResourceEndpoints?: ResourceEndpoints;
  public ProjectEndpoints?: ProjectEndpoints;

  public constructor(clientOpt: ClientOptions) {
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
    this.ProjectEndpoints = new ProjectEndpoints(clientOpt);
  }
}

export { ResourceEndpoints, ProjectEndpoints };
