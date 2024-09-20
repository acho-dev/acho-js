import { Acho } from '../src/index';

jest.setTimeout(30000);

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

  it('capture published app element', async () => {
    const appInstance = AchoInstance.app('95240eba-ec4e-4124-86a1-7403f18e6600');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const result = await appInstance.capturePublishedAppElementAsPDF({
      elementId: 'elIixzCARp',
      path: '/home',
      dimensions: {
        width: 794,
        height: 1123
      },
      footer: true
    });
    console.log(result);
    expect(result).toBeInstanceOf(Object);
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
