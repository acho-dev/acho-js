import { Acho } from '../src/index';

describe('test OAuth endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('get oauth list', async () => {
    const data = await AchoInstance.OAuthEndpoints.getOAuthClientList();
    expect(data).toBeInstanceOf(Object);
    console.log(data);
  });

  it.skip('get oauth token', async () => {
    const data = await AchoInstance.OAuthEndpoints.getOAuthToken({ id: '4ee0dbf0-92ce-48e1-b5c1-b9248217041a' });
    expect(typeof data).toBe('string');
    console.log(data);
  });
});
