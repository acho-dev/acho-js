import { Acho } from '../src/index';

describe('test OAuth endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('get oauth list', async () => {
    const data = await AchoInstance.OAuthEndpoints.getOAuthClientList();
    expect(data).toBeInstanceOf(Object);
    console.log(data);
  });

  it.skip('get oauth token', async () => {
    const data = await AchoInstance.OAuthEndpoints.getOAuthClient({ id: 'bedcf896-0bc6-4c29-9ac7-2f4d8007725a' });
    expect(data).toBeInstanceOf(Object);
    console.log(data);
  });
});
