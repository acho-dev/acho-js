import { ResourceHelperInfo } from './resource';
import { ProjectHelperInfo } from './project';

export * from './resource';
export * from './project';

export interface ActionQuery {
  query: string;
  helperInfo: HelperInfo;
}

export interface HelperInfo {
  resources: Array<ResourceHelperInfo>;
  projects: Array<ProjectHelperInfo>;
}
