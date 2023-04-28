import { Acho } from '../src/index';

describe('test App endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  it('init app', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
  });

  it('validate app version', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const appVersionInstance = await appInstance.version('352');
    appVersionInstance.disconnect();
  });

  it('test app version room', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    // console.log(appInstance);
    const metadata = await appInstance.init();
    const appVersionInstance = await appInstance.version('352');
    // console.log(appVersionInstance);
    const joined = await appVersionInstance.join();
    // console.log(joined);
    expect(joined).toEqual('joined');
    const left = await appVersionInstance.leave();
    // console.log(left);
    expect(left).toEqual('left');
    appVersionInstance.disconnect();
  });
});
