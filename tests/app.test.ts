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
    const appInstance = AchoInstance.app('0b6dcdad-bcdd-4c8e-b888-8d3296d4a1fc');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const result = await appInstance.capturePublishedAppElementAsPDF({
      elementId: 'elNyvmveSJ',
      path: '/home',
      dimensions: {
        width: 794,
        height: 1123
      },
      footer: true,
      payload: {
        hello: 'world'
      }
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
