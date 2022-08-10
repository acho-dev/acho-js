import { Acho } from '../src/index';

describe('test resource endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  let assetResp: any;
  let resResp: any;

  test('get simple resource table by assetId', async () => {
    assetResp = await AchoInstance.ResourceEndpoints?.getTableData({ assetId: 9244 }); // Test get by assetId
    expect(assetResp).toBeInstanceOf(Object);
    expect(assetResp).toHaveProperty('data');
    expect(assetResp).toHaveProperty('schema');
    expect(assetResp).toHaveProperty('paging');

    const { data: _data, schema, paging } = assetResp;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);
  });

  test('get simple resource table by resId', async () => {
    resResp = await AchoInstance.ResourceEndpoints?.getTableData({ resId: 4649 }); // Test get by resId
    expect(resResp).toBeInstanceOf(Object);
    expect(resResp).toHaveProperty('data');
    expect(resResp).toHaveProperty('schema');
    expect(resResp).toHaveProperty('paging');

    const { data: _data, schema, paging } = resResp;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);
  });

  test('resource table result consistency', async () => {
    expect(assetResp).not.toBeUndefined();
    expect(resResp).not.toBeUndefined();
    expect(assetResp).toEqual(resResp);
  });
});
