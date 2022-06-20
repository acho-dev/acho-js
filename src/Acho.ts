import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';

export default class Acho {
  public ResourceEndpoints?: ResourceEndpoints;

  public constructor({ apiToken = undefined }: ClientOptions) {
    this.ResourceEndpoints = new ResourceEndpoints();
  }
}

export { ResourceEndpoints };
