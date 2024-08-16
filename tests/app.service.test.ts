import { Acho } from '../src/index';

describe('test App Service provider', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('init app', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
  });

  it('get published app version', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const publishedVersion = await appInstance.getPublishedVersion();
    expect(publishedVersion).toBeInstanceOf(Object);
  });

  it('discover app services', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const _services = await appInstance.discoverServices();
    expect(_services).toBeInstanceOf(Object);
    console.log(_services);
  });

  it('test plugin class service', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const _services = await appInstance.discoverServices();
    const auditLogService = _services.find((service) => service.id === 'team-607-api-e4513a6f-d28a-4103-92a2-efe5fa487ca8');
    expect(auditLogService).toBeInstanceOf(Object);
    const payload = {
      level: 'info',
      type: 'audit',
      message: `Test message from SDK`,
      metadata: {}
    };
    console.log(auditLogService);
    console.log(auditLogService.getConfig(payload));
    const request = await auditLogService.request(payload);
    console.log(request);
  });

  it('test event class service w/ job', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const _services = await appInstance.discoverServices();
    const auditLogService = _services.find((service) => service.id === 'custom_event');
    console.log(auditLogService);
    expect(auditLogService).toBeInstanceOf(Object);
    const payload = {
      level: 'info',
      type: 'audit',
      message: `Test message from SDK`,
      metadata: {}
    };
    console.log(auditLogService.getConfig(payload));
    const request = await auditLogService.request(payload);
    console.log(request);
  });

  it('test event class service w/ job in batch', async () => {
    const appInstance = AchoInstance.app('945befce-f82a-4e67-ac19-3781107e6a5d');
    expect(appInstance).toBeInstanceOf(Object);
    const metadata = await appInstance.init();
    const _services = await appInstance.discoverServices();

    const auditLogService = _services.find((service) => service.id === 'custom_event');
    const auditLogService2 = _services.find((service) => service.id === 'not_custom_event');
    const auditLogService3 = _services.find((service) => service.id === 'fixed_event');
    const auditLogService4 = _services.find((service) => service.id === 'rigid_event');
    expect(auditLogService).toBeInstanceOf(Object);
    const payload = {
      level: 'info',
      type: 'audit',
      message: `Test message from SDK`,
      metadata: {}
    };
    for (let i = 0; i < 5; i++) {
      const _payload = {
        ...payload,
        message: `Test message from SDK ${i}`
      };
      auditLogService.request(_payload, { timeout: 10000 }).then((response: any) => {});
      auditLogService2.request(_payload, { timeout: 10000 }).then((response: any) => {});
      auditLogService3.request(_payload, { timeout: 10000 }).then((response: any) => {});
      auditLogService4.request(_payload, { timeout: 10000 }).then((response: any) => {});
    }
  });
});
