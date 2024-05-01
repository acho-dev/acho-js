import _ from 'lodash';

import { Acho } from '../src/index';

describe('test AutomationClient endpoints', () => {
  console.log({
    endpoint: process.env.ACHO_API_ENDPOINT,
    token: process.env.ACHO_TOKEN
  });

  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('get log', async () => {
    const autoClient = AchoInstance.automationClient({});
    expect(autoClient).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const resp = await autoClient.getLog();
    expect(_.isArray(resp?.data)).toBe(true);
    expect(_.isPlainObject(resp?.meta)).toBe(true);
  });

  it('write log', async () => {
    const autoClient = AchoInstance.automationClient({});
    expect(autoClient).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    await autoClient.writeLog({
      level: 'debug',
      message: 'Test from acho-js',
      metadata: {
        invoker: 'automationClient.test.ts'
      }
    });

    await process.nextTick(() => {});
    const resp = await autoClient.getLog();
    const { level, message, metadata } = _.get(resp, ['data', 0]);
    expect(level === 'debug' && message === 'Test from acho-js' && metadata['invoker'] === 'automationClient.test.ts').toBe(true);
  });
});
