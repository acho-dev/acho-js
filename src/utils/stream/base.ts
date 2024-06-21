import EventEmitter from 'events';
import { Readable } from 'stream';

class AbstractTransformationProvider {
  // Abstract class for transformation providers
  constructor() {
    if (new.target === AbstractTransformationProvider) {
      throw new TypeError('Cannot construct TransformationProvider instances directly');
    }
  }

  _transform(record: Record<string, any>): Record<string, any> {
    throw new Error('Not implemented');
  }

  async _transformAsync(record: Record<string, any>): Promise<Record<string, any>> {
    throw new Error('Not implemented');
  }
}

class RuleBasedTransformationProvider extends AbstractTransformationProvider {
  rules: any;
  constructor(rules: any) {
    super();
    this.rules = rules;
  }
  // Rule-based transformation logic
  _transform(record: any) {
    return this.rules.reduce((acc: any, rule: (arg0: any) => any) => {
      return rule(acc);
    }, record);
  }

  _transformAsync(record: Record<string, any>): Promise<Record<string, any>> {
    return this.rules.reduce(async (acc: any, rule: (arg0: any) => any) => {
      return rule(await acc);
    }, Promise.resolve(record));
  }
}

class CustomTransformationProvider extends AbstractTransformationProvider {
  customTransform: any;
  constructor(customTransform: any) {
    super();
    this.customTransform = customTransform;
  }
  // Custom transformation logic
  _transform(record: any) {
    return this.customTransform(record);
  }

  async _transformAsync(record: Record<string, any>): Promise<Record<string, any>> {
    return this.customTransform(record);
  }
}

class DefaultTransformationProvider extends AbstractTransformationProvider {
  // Default transformation logic: flatten the whole JSON array
  _transform(record: any) {
    return flattenObject(record);
  }
}

class BasicStreamer extends EventEmitter {
  transformationProvider: DefaultTransformationProvider;
  _transform: (record: any) => Record<string, any>;
  constructor(transformationProvider: any = new DefaultTransformationProvider()) {
    super();
    this.transformationProvider = transformationProvider;
    this._transform = this.transformationProvider._transform.bind(this.transformationProvider);
  }

  _feed(record: any) {
    const transformedRecord = this._transform(record);
    if (transformedRecord?.length) {
      transformedRecord.forEach((record: any) => {
        this.emit('data', record);
      });
    }
    this.emit('data', transformedRecord);
  }

  setTransformationProvider(provider: any) {
    this.transformationProvider = provider;
    this._transform = this.transformationProvider._transform.bind(this.transformationProvider);
  }
}

class AsyncStreamer extends EventEmitter {
  transformationProvider: any;
  _transformAsync: (record: any) => Promise<Record<string, any>>;
  constructor(transformationProvider: any = new DefaultTransformationProvider()) {
    super();
    this.transformationProvider = transformationProvider;
    this._transformAsync = this.transformationProvider._transformAsync.bind(this.transformationProvider);
  }

  async _feed(record: any) {
    const transformedRecord = await this._transformAsync(record);
    if (transformedRecord?.length) {
      transformedRecord.forEach((record: any) => {
        this.emit('data', record);
      });
    }
    this.emit('data', transformedRecord);
  }

  setTransformationProvider(provider: any) {
    this.transformationProvider = provider;
    this._transformAsync = this.transformationProvider._transformAsync.bind(this.transformationProvider);
  }
}

function flattenObject(obj: { [x: string]: any }, prefix = '', res: Record<string, any> = {}) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      flattenObject(obj[key], `${prefix}${key}.`, res);
    } else {
      res[`${prefix}${key}`] = obj[key];
    }
  }
  return res;
}

export {
  BasicStreamer,
  AsyncStreamer,
  RuleBasedTransformationProvider,
  CustomTransformationProvider,
  DefaultTransformationProvider,
  flattenObject
};
