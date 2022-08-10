import { Acho } from '../src/index';

describe('test resource endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('get simple resource table by assetId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.getTableData({ assetId: 9244 }); // Test get by assetId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema.toBeInstanceOf(Object));
    expect(paging.toBeInstanceOf(Object));
  });

  it('get simple resource table by resId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.getTableData({ resId: 4649 }); // Test get by resId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema.toBeInstanceOf(Object));
    expect(paging.toBeInstanceOf(Object));
  });

  it('resource table result consistency', async () => {
    const assetResp = await AchoInstance.ResourceEndpoints?.getTableData({ assetId: 9244 }); // Test get by assetId
    const resResp = await AchoInstance.ResourceEndpoints?.getTableData({ resId: 4649 }); // Test get by resId
    expect(assetResp).toEqual(resResp);
  });
});
