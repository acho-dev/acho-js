import _ from 'lodash';

import { Acho } from '../src/index';

describe('test BusinessObject endpoints', () => {
  console.log({
    endpoint: process.env.ACHO_API_ENDPOINT,
    token: process.env.ACHO_TOKEN
  });

  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('get obj', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'customer' });
    expect(bizObjInstance).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const resp = await bizObjInstance.getObject();
    expect(resp.tableName === 'customer').toBe(true);
    expect(resp.teamId === 1061).toBe(true);
  });

  it('get data', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'customer' });
    expect(bizObjInstance).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const resp = await bizObjInstance.getData();
    expect(_.isArray(resp?.data)).toBe(true);
    expect(_.isPlainObject(resp?.meta)).toBe(true);
  });

  it('edit row', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'customer' });
    expect(bizObjInstance).toBeInstanceOf(Object);

    await process.nextTick(() => {});
    const timestamp1 = Date.now();
    await bizObjInstance.addRow({
      rows: [
        {
          name: `achojsTestUser${timestamp1}`,
          email: 'achojsTestUser@lc.com',
          phone: '1234567890',
          address: '1 Main St',
          company: 'Lethal Company',
          created_at: {
            type: 'sql',
            value: 'NOW()'
          },
          updated_at: {
            type: 'sql',
            value: 'NOW()'
          },
          created_by: 'admin',
          updated_by: 'admin',
          agent_id: 0
        }
      ]
    });
    const resp1 = await bizObjInstance.getData();
    expect(_.get(resp1, ['data', 0, 'name']) === `achojsTestUser${timestamp1}`).toBe(true);

    await process.nextTick(() => {});
    const timestamp2 = Date.now();
    await bizObjInstance.updateRow({
      ctid: _.get(resp1, ['data', 0, 'ctid']),
      changes: {
        name: `achojsTestUser${timestamp2}`
      }
    });
    const resp2 = await bizObjInstance.getData();
    expect(_.get(resp2, ['data', 0, 'name']) === `achojsTestUser${timestamp2}`).toBe(true);

    await process.nextTick(() => {});
    await bizObjInstance.deleteRow({
      ctid: _.get(resp2, ['data', 0, 'ctid'])
    });
    const resp3 = await bizObjInstance.getData();
    expect(_.get(resp3, ['data', 0, 'ctid']) !== _.get(resp2, ['data', 0, 'ctid'])).toBe(true);
  });
});
