import _, { last } from 'lodash';

import { Acho } from '../src/index';
import { BusinessObject } from '../src/businessObject';

describe('test BusinessObject endpoints', () => {
  console.log({
    endpoint: process.env.ACHO_API_ENDPOINT,
    token: process.env.ACHO_TOKEN
  });

  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('list objects', async () => {
    const bizObjInstance = AchoInstance.businessObject();
    expect(bizObjInstance).toBeInstanceOf(BusinessObject);

    await process.nextTick(() => {});
    const resp = await bizObjInstance.listObjects();
    expect(_.isArray(resp)).toBe(true);
  });

  it('get obj', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'sample_customers' });
    expect(bizObjInstance).toBeInstanceOf(BusinessObject);

    await process.nextTick(() => {});
    const resp = await bizObjInstance.getObject();
    expect(resp.tableName === 'sample_customers').toBe(true);
    expect(resp.teamId === 607).toBe(true);
  });

  it('get data', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'sample_customers' });
    expect(bizObjInstance).toBeInstanceOf(BusinessObject);

    await process.nextTick(() => {});
    const resp = await bizObjInstance.getData();
    expect(_.isArray(resp?.data)).toBe(true);
    expect(_.isPlainObject(resp?.meta)).toBe(true);
  });

  it('edit row', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'sample_customers' });
    expect(bizObjInstance).toBeInstanceOf(BusinessObject);

    await process.nextTick(() => {});
    const timestamp1 = Date.now();
    await bizObjInstance.addRow({
      rows: [
        {
          first_name: `achojsTestUser${timestamp1}`,
          last_name: 'Test',
          email: 'achojsTestUser@lc.com',
          phone: '1234567890',
          created_at: {
            type: 'sql',
            value: 'NOW()'
          },
          updated_at: {
            type: 'sql',
            value: 'NOW()'
          }
        }
      ]
    });
    const resp1 = await bizObjInstance.getData({ sortOptions: [{ expr: 'created_at', exprOrder: 'desc', nullOrder: 'last' }] });
    console.log(resp1);
    expect(_.get(resp1, ['data', 0, 'first_name']) === `achojsTestUser${timestamp1}`).toBe(true);

    await process.nextTick(() => {});
    const timestamp2 = Date.now();
    await bizObjInstance.updateRow({
      ctid: _.get(resp1, ['data', 0, 'ctid']),
      changes: {
        first_name: `achojsTestUser${timestamp2}`
      }
    });
    const resp2 = await bizObjInstance.getData();
    expect(_.get(resp2, ['data', 0, 'first_name']) === `achojsTestUser${timestamp2}`).toBe(true);

    await process.nextTick(() => {});
    await bizObjInstance.deleteRow({
      ctid: _.get(resp2, ['data', 0, 'ctid'])
    });
    const resp3 = await bizObjInstance.getData();
    expect(_.get(resp3, ['data', 0, 'ctid']) !== _.get(resp2, ['data', 0, 'ctid'])).toBe(true);
  });

  it('write stream', async () => {
    const bizObjInstance = AchoInstance.businessObject({ tableName: 'sample_purchase_order_items' });
    expect(bizObjInstance).toBeInstanceOf(BusinessObject);

    await process.nextTick(() => {});
    const bizObj = await bizObjInstance.getObject();
    console.log(bizObj);
    const writable = bizObjInstance.createWriteStream({});
    [1, 2, 3].forEach(async (i) => {
      writable.write(
        JSON.stringify({
          total_price: i * 100,
          unit_price: 'n/a'
        }) + '\n'
      ); // Add your data here
    });
    writable.end();
  });
});
