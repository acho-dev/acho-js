import { Acho } from '../src/index';

describe('test resource:getTableData', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  let assetResp: any;
  let resResp: any;

  test('get simple resource table by assetId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.getTableData({ assetId: 9244 }); // Test get by assetId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);

    assetResp = data;
  });

  test('get simple resource table by resId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.getTableData({ resId: 4649 }); // Test get by resId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);

    resResp = data;
  });

  test('resource table result consistency', async () => {
    expect(assetResp).not.toBeUndefined();
    expect(resResp).not.toBeUndefined();
    expect(assetResp).toEqual(resResp);
  });
});

describe('test resource:download', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  let assetResp: any;
  let resResp: any;

  test('download simple resource table by assetId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.downloadTableData({ assetId: 9244 }); // Test get by assetId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('archiveName');

    const { url } = data;
    expect(url).toEqual(expect.stringContaining('https://storage.googleapis.com'));

    assetResp = data;
  });

  test('download simple resource table by resId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.downloadTableData({ resId: 4649 }); // Test get by resId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('archiveName');

    const { url } = data;
    expect(url).toEqual(expect.stringContaining('https://storage.googleapis.com'));

    resResp = data;
  });

  test('download table result consistency', async () => {
    expect(assetResp).not.toBeUndefined();
    expect(resResp).not.toBeUndefined();
    const { archiveName: assetArchiveName } = assetResp;
    const { archiveName: resArchiveName } = resResp;
    const descriptorA = assetArchiveName.split('_').slice(0, 1);
    const descriptorB = resArchiveName.split('_').slice(0, 1);
    expect(descriptorA).toEqual(descriptorB);
  });
});
