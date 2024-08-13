import { Acho } from '../src/index';

describe('test App endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
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

  it('list app versions', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const versions = await appInstance.listVersions();
    expect(versions).toBeInstanceOf(Array);
  });

  it('get published app version', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const publishedVersion = await appInstance.getPublishedVersion();
    expect(publishedVersion).toBeInstanceOf(Object);
  });

  it('discover app services', async () => {
    const appInstance = AchoInstance.app('328');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const services = await appInstance.discoverServices();
    expect(services).toBeInstanceOf(Object);
    console.log(services);
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
