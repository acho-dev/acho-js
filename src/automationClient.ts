import _ from 'lodash';

import { AchoClient } from '.';
import { ClientOptions, RequestOptions } from './types';
import { BusinessObject } from './businessObject';

export class AutomationClient {
  public achoClientOpt: ClientOptions;
  public jobTableName: string = 'erp_jobs';
  public logTableName: string = 'erp_logs';

  constructor(autoClientOpt: Record<string, any>, achoClientOpt?: ClientOptions) {
    this.achoClientOpt = {
      ...achoClientOpt,
      apiToken: achoClientOpt?.apiToken || process.env.ACHO_TOKEN
    };

    if (!_.isNil(autoClientOpt?.jobTableName) && _.isString(autoClientOpt?.jobTableName)) {
      this.jobTableName = autoClientOpt?.jobTableName;
    }
    if (!_.isNil(autoClientOpt?.logTableName) && _.isString(autoClientOpt?.logTableName)) {
      this.logTableName = autoClientOpt?.logTableName;
    }
  }

  public async getLog(params: Record<string, any> = {}) {
    const bizObj = new BusinessObject({ tableName: this.logTableName }, this.achoClientOpt);
    const resp = await bizObj.getData();

    return resp;
  }

  public async writeLog(params: Record<string, any> = {}) {
    const { level, message, metadata } = params;
    if (!_.isString(level)) {
      throw new Error('Only string is allowed for log level');
    }
    if (!_.isString(message)) {
      throw new Error('Only string is allowed for log message');
    }
    if (!_.isPlainObject(metadata)) {
      if (_.isString(metadata)) {
        try {
          JSON.parse(metadata);
        } catch (err) {
          throw new Error('Only JSON or stringified JSON is allowed for log metadata');
        }
      } else {
        throw new Error('Only JSON or stringified JSON is allowed for log metadata');
      }
    }

    const bizObj = new BusinessObject({ tableName: this.logTableName }, this.achoClientOpt);
    const resp = await bizObj.addRow({
      rows: [
        {
          level,
          message,
          metadata: {
            type: 'json',
            value: metadata
          }
        }
      ]
    });

    return resp;
  }
}
