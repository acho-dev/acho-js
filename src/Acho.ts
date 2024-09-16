import { ClientOptions } from '.';
import { ResourceEndpoints } from './resource';
import { ProjectEndpoints } from './project';
import { OAuthEndpoints } from './auth';
import { App } from './app';
import { BusinessObject } from './businessObject';
import { AutomationClient } from './automationClient';
import { AppUsers } from './appUser';
import { MediaFile } from './mediaFile';
import {
  BasicStreamer,
  AsyncStreamer,
  RuleBasedTransformationProvider,
  CustomTransformationProvider,
  DefaultTransformationProvider,
  flattenObject,
  streamToBuffer
} from './utils';
import { fromPairs } from 'lodash';

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

  public appUsers(clientOpt: ClientOptions = this.clientOpt) {
    return new AppUsers(clientOpt);
  }

  public businessObject(bizObjClientOpt: Record<string, any> = {}, achoClientOpt: ClientOptions = this.clientOpt) {
    return new BusinessObject(bizObjClientOpt, achoClientOpt);
  }

  public automationClient(autoClientOpt: Record<string, any>, achoClientOpt: ClientOptions = this.clientOpt) {
    return new AutomationClient(autoClientOpt, achoClientOpt);
  }

  public mediaFile(mediaFileOpt: Record<string, any>, achoClientOpt: ClientOptions = this.clientOpt) {
    return new MediaFile(mediaFileOpt, achoClientOpt);
  }
}

export {
  ResourceEndpoints,
  ProjectEndpoints,
  OAuthEndpoints,
  BusinessObject,
  App,
  MediaFile,
  BasicStreamer,
  AsyncStreamer,
  RuleBasedTransformationProvider,
  CustomTransformationProvider,
  DefaultTransformationProvider,
  flattenObject,
  streamToBuffer
};
