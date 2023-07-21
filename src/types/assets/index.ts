import { ResourceHelperInfo } from './resource';
import { ProjectHelperInfo, ViewHelperInfo } from './project';

export * from './resource';
export * from './project';
export * from './auth';

export interface ActionQuery {
  query: string;
  helperInfo: HelperInfo;
}

export interface HelperInfo {
  resources: Array<ResourceHelperInfo>;
  projects: Array<ProjectHelperInfo>;
  views?: Array<ViewHelperInfo>;
}
