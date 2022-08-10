import { Acho } from '../src/index';

describe('test resource endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('get simple resource table', async () => {
    const data = await AchoInstance.ResourceEndpoints?.getTableData({ assetId: 9140 }); // Test get by assetId
    console.log(data);
    expect(data).toBeInstanceOf(Object);
  });
});
