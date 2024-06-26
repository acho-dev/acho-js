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

  it('logs', async () => {
    const autoClient = AchoInstance.automationClient({});
    expect(autoClient).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const getResp1 = await autoClient.getLog();
    expect(_.isArray(getResp1?.data)).toBe(true);
    expect(_.isPlainObject(getResp1?.meta)).toBe(true);

    await process.nextTick(() => {});
    await autoClient.writeLog({
      level: 'debug',
      message: 'Test from acho-js',
      metadata: {
        invoker: 'automationClient.test.ts'
      }
    });

    await process.nextTick(() => {});
    const getResp2 = await autoClient.getLog();
    const { level, message, metadata } = _.get(getResp2, ['data', 0]);
    expect(level === 'debug' && message === 'Test from acho-js' && metadata['invoker'] === 'automationClient.test.ts').toBe(true);
  });

  it('jobs', async () => {
    const autoClient = AchoInstance.automationClient({});
    expect(autoClient).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const getResp1 = await autoClient.getJob();
    expect(_.isArray(getResp1?.data)).toBe(true);
    expect(_.isPlainObject(getResp1?.meta)).toBe(true);

    await process.nextTick(() => {});
    const timestamp = Date.now();
    await autoClient.createJob({
      id: `test-job-${timestamp}`,
      name: `Test Job ${timestamp}`,
      status: 'pending',
      payload: {
        pay: 'load'
      },
      metadata: {
        meta: 'data'
      }
    });

    await process.nextTick(() => {});
    const getResp2 = await autoClient.getJob();
    const { id: id1, status: status1 } = _.get(getResp2, ['data', 0]);
    expect(id1 === `test-job-${timestamp}` && status1 === 'pending').toBe(true);

    await process.nextTick(() => {});
    await autoClient.updateJob({
      id: `test-job-${timestamp}`,
      status: 'completed'
    });

    await process.nextTick(() => {});
    const getResp3 = await autoClient.getJob();
    const { id: id2, status: status2 } = _.get(getResp3, ['data', 0]);
    expect(id2 === `test-job-${timestamp}` && status2 === 'completed').toBe(true);

    await process.nextTick(() => {});
    await autoClient.deleteJob({
      id: `test-job-${timestamp}`
    });

    await process.nextTick(() => {});
    const getResp4 = await autoClient.getJob();
    const { id: id3 } = _.get(getResp4, ['data', 0]);
    expect(id3 !== `test-job-${timestamp}`).toBe(true);
  });
});
