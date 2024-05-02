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

  public async getJob(params: Record<string, any> = {}) {
    const bizObj = new BusinessObject({ tableName: this.jobTableName }, this.achoClientOpt);
    const resp = await bizObj.getData();

    return resp;
  }

  public async createJob(params: Record<string, any> = {}) {
    const { id, name, status, payload = {}, metadata = {} } = params;
    if (_.isNil(name)) {
      throw new Error('Missing job name');
    }
    if (!_.isString(name)) {
      throw new Error('Only string is allowed for job name');
    }
    if (_.isNil(status)) {
      throw new Error('Missing job status');
    }
    if (!_.isString(status)) {
      throw new Error('Only string is allowed for job status');
    }

    const bizObj = new BusinessObject({ tableName: this.jobTableName }, this.achoClientOpt);
    const row = {
      id,
      name,
      status,
      payload: {
        type: 'json',
        value: payload
      },
      metadata: {
        type: 'json',
        value: metadata
      }
    };
    const sanitizedRow = _.omitBy(row, _.isUndefined);
    const resp = await bizObj.addRow({
      rows: [
        {
          ...sanitizedRow
        }
      ]
    });

    return resp;
  }

  public async updateJob(params: Record<string, any> = {}) {
    const { id, name, status, payload, metadata } = params;
    if (_.isNil(id)) {
      throw new Error('Missing job id');
    }
    if (!_.isString(id)) {
      throw new Error('Only string is allowed for job id');
    }
    if (_.every([name, status, payload, metadata], _.isUndefined)) {
      throw new Error('No valid changes provided');
    }
    if (!_.isNil(name) && !_.isString(name)) {
      throw new Error('Only string is allowed for job name');
    }
    if (!_.isNil(status) && !_.isString(status)) {
      throw new Error('Only string is allowed for job status');
    }
    if (!_.isNil(payload) && !_.isPlainObject(payload)) {
      throw new Error('Only JSON is allowed for job payload');
    }
    if (!_.isNil(metadata) && !_.isPlainObject(metadata)) {
      throw new Error('Only JSON is allowed for job metadata');
    }

    const bizObj = new BusinessObject({ tableName: this.jobTableName }, this.achoClientOpt);
    const filter = {
      logicalOperator: 'AND',
      conditions: [
        {
          type: 'compare',
          negate: false,
          operator: '=',
          field: ['id'],
          value: id
        }
      ]
    };
    const changes = {};
    if (name) _.set(changes, ['name'], name);
    if (status) _.set(changes, ['status'], status);
    if (payload) _.set(changes, ['payload'], { type: 'json', value: payload });
    if (metadata) _.set(changes, ['metadata'], { type: 'json', value: metadata });

    const resp = await bizObj.updateRow({
      filter,
      changes
    });

    return resp;
  }

  public async deleteJob(params: Record<string, any> = {}) {
    const { id } = params;
    if (_.isNil(id)) {
      throw new Error('Missing job id');
    }
    if (!_.isString(id)) {
      throw new Error('Only string is allowed for job id');
    }

    const bizObj = new BusinessObject({ tableName: this.jobTableName }, this.achoClientOpt);
    const filter = {
      logicalOperator: 'AND',
      conditions: [
        {
          type: 'compare',
          negate: false,
          operator: '=',
          field: ['id'],
          value: id
        }
      ]
    };

    const resp = await bizObj.deleteRow({
      filter
    });

    return resp;
  }
}
