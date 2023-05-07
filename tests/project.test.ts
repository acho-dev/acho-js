import { Acho } from '../src/index';

describe('test project endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('get project table by viewId with page size of 10', async () => {
    const data = await AchoInstance.ProjectEndpoints.getViewData({ viewId: 7869, pageSize: 10 });
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    expect(data.data.length).toBeLessThanOrEqual(10);
  });

  it('get project table by assetId with default page size', async () => {
    const data = await AchoInstance.ProjectEndpoints.getViewData({ assetId: 9242 });
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    expect(data.data.length).toBeLessThanOrEqual(100);
  });
});
