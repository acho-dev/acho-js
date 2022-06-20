import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';

export default class Acho {
  public ResourceEndpoints?: ResourceEndpoints;

  public constructor(clientOpt: ClientOptions) {
    this.ResourceEndpoints = new ResourceEndpoints(clientOpt);
  }
}

export { ResourceEndpoints };
