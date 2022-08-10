import { Acho } from '../src/index';

describe('test project endpoints', () => {
  // TODO: expose a login endpoint to get token for tests??
  // TODO: what should be the base url for testing? localhost or dev?
  const AchoInstance = new Acho({
    apiToken: process.env.token,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('should get all project tables', async () => {
    const data = await AchoInstance.ProjectEndpoints?.getViewData({ assetId: 9246, viewId: 7869 }); // TODO: assetId? viewId? other params?
    console.log(data);
    expect(data).toBeInstanceOf(Object); // TODO: match a response type
  });
});
