import { Acho } from '../src/index';

describe('test App endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('init app', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    console.log(appInstance);
    const metadata = await appInstance.init();
    console.log(metadata);
  });
});
