const EventEmitter = require('events');
const { Readable } = require('stream');

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
}

class DefaultTransformationProvider extends AbstractTransformationProvider {
  // Default transformation logic: flatten the whole JSON array
  _transform(record: any) {
    return flattenObject(record);
  }
}

class BasicStreamer extends Readable {
  constructor(transformationProvider = new DefaultTransformationProvider(), options = {}) {
    super(options);
    this.eventEmitter = new EventEmitter();
    this.transformationProvider = transformationProvider;
    this._transform = this.transformationProvider._transform.bind(this.transformationProvider);
    this.records = [];
  }

  _read() {
    if (this.records.length > 0) {
      const record = this.records.shift();
      const transformedRecord = this._transform(record);
      this.push(JSON.stringify(transformedRecord) + '\n');
      this.eventEmitter.emit('data', transformedRecord);
    } else {
      this.push(null); // No more data
    }
  }

  _feed(record: any) {
    this.records.push(record);
    this.eventEmitter.emit('data', record);
    if (this.records.length === 1) {
      // Trigger reading if it is the first record
      this.read(0);
    }
  }

  setTransformationProvider(provider: any) {
    this.transformationProvider = provider;
    this._transform = this.transformationProvider._transform.bind(this.transformationProvider);
  }

  on(event: any, listener: any) {
    this.eventEmitter.on(event, listener);
  }

  off(event: any, listener: any) {
    this.eventEmitter.off(event, listener);
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

module.exports = {
  BasicStreamer,
  RuleBasedTransformationProvider,
  CustomTransformationProvider,
  DefaultTransformationProvider,
  flattenObject
};
