import { Acho } from '../src/index';

describe('test App endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('test retrieve', async () => {
    const appUsers = AchoInstance.appUsers();
    expect(appUsers).toBeInstanceOf(Object);
    const firstPage = await appUsers.retrieve();
    console.log(firstPage);
    expect(firstPage).toBeInstanceOf(Object);
  });
});
