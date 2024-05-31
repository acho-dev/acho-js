import { Acho } from '../src/index';

describe('test AppUser endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('init app', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
  });
});
