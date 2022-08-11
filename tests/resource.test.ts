import { Acho } from '../src/index';
import { ActionQuery, ResourceTableDataResp } from '../src/types';

describe('test resource:getTableData', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  let assetResp: ResourceTableDataResp;
  let resResp: ResourceTableDataResp;

  test('get simple resource table by assetId', async () => {
    const data = await AchoInstance.ResourceEndpoints.getTableData({ assetId: 9244 }); // Test get by assetId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);

    assetResp = data;
  });

  test('get simple resource table by resId', async () => {
    const data = await AchoInstance.ResourceEndpoints.getTableData({ resId: 4649 }); // Test get by resId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');

    const { data: _data, schema, paging } = data;
    expect(_data).toBeInstanceOf(Array);
    expect(schema).toBeInstanceOf(Object);
    expect(paging).toBeInstanceOf(Object);

    resResp = data;
  });

  test('resource table result consistency', async () => {
    expect(assetResp).not.toBeUndefined();
    expect(resResp).not.toBeUndefined();
    expect(assetResp).toEqual(resResp);
  });
});

describe('test resource:download', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  let assetResp: any;
  let resResp: any;

  test('download simple resource table by assetId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.downloadTableData({ assetId: 9244 }); // Test get by assetId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('archiveName');

    const { url } = data;
    expect(url).toEqual(expect.stringContaining('https://storage.googleapis.com'));

    assetResp = data;
  });

  test('download simple resource table by resId', async () => {
    const data = await AchoInstance.ResourceEndpoints?.downloadTableData({ resId: 4649 }); // Test get by resId
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty('url');
    expect(data).toHaveProperty('archiveName');

    const { url } = data;
    expect(url).toEqual(expect.stringContaining('https://storage.googleapis.com'));

    resResp = data;
  });

  test('download table result consistency', async () => {
    expect(assetResp).not.toBeUndefined();
    expect(resResp).not.toBeUndefined();
    const { archiveName: assetArchiveName } = assetResp;
    const { archiveName: resArchiveName } = resResp;
    const descriptorA = assetArchiveName.split('_').slice(0, 1);
    const descriptorB = resArchiveName.split('_').slice(0, 1);
    expect(descriptorA).toEqual(descriptorB);
  });
});

describe('test resource:query', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  const actionQuery: ActionQuery = {
    query: 'SELECT * FROM {{{R.4650}}};',
    helperInfo: {
      resources: [
        {
          resource: {
            access_groups: [
              { id: 1, name: 'view' },
              { id: 2, name: 'edit' },
              { id: 3, name: 'import' },
              { id: 4, name: 'export' },
              { id: 5, name: 'management_view' },
              { id: 6, name: 'management_edit' }
            ],
            access_role_id: 1,
            asset_id: 9248,
            create_time: 1660228479,
            id: 4650,
            is_creator: true,
            is_private: 0,
            is_ready: 1,
            is_scheduled: null,
            owner_id: 5612,
            res_display_name: 'superstore_order_csv',
            res_name: '5612_superstore_order_csv_1660228479565',
            res_type: 'csvBucket',
            scheduler_id: null,
            team_id: 607,
            update_frequency: null,
            update_query: null,
            update_status: null,
            user_id: 5612
          },
          resourceTable: ''
        }
      ],
      projects: []
    }
  };

  let pageToken: string | undefined;
  let jobId: string | undefined;
  let resResp: Array<Object>;

  test('get resource table with query and page size of 10', async () => {
    const data = await AchoInstance.ResourceEndpoints.queryTableData({ actionQuery, page: 2, pageSize: 10 });
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');
    expect(data).toHaveProperty('jobId');

    const { data: _data, schema, paging, jobId: _jobId } = data;
    expect(_data.length).toBe(10);
    expect(schema).toHaveProperty('fields');
    expect(paging).toHaveProperty('pageToken');
    pageToken = paging.pageToken;
    jobId = _jobId;
  });

  test('get resource table with pageToken and jobId', async () => {
    const data = await AchoInstance.ResourceEndpoints.queryTableData({ actionQuery, pageToken, jobId, pageSize: 10 });
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');
    expect(data).toHaveProperty('jobId');

    const { data: _data, schema, paging, jobId: _jobId } = data;
    expect(_data.length).toBe(10);
    expect(schema).toHaveProperty('fields');
    expect(paging).toHaveProperty('pageToken');
    resResp = _data;
  });

  test('resource table result consistency', async () => {
    const data = await AchoInstance.ResourceEndpoints.queryTableData({ actionQuery, page: 3, pageSize: 10 });
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');
    expect(data).toHaveProperty('jobId');

    const { data: _data, schema, paging, jobId: _jobId } = data;
    expect(_data.length).toBe(10);
    expect(schema).toHaveProperty('fields');
    expect(paging).toHaveProperty('pageToken');
    expect(_data).toEqual(resResp);
  });

  test('get Airbyte resource table with query and default page size', async () => {
    actionQuery.query = 'SELECT * FROM {{{R.4651.Sheet1}}};';
    actionQuery.helperInfo.resources = [
      {
        resource: {
          access_role_id: 1,
          asset_id: 9249,
          create_time: 1660239228,
          id: 4651,
          is_creator: true,
          is_private: 0,
          is_ready: 1,
          is_scheduled: null,
          owner_id: 5612,
          real_type: 'integration',
          res_display_name: 'Glossary list',
          res_name: 'integration_5612_Google_Sheets_1660239228',
          res_type: 'Google_Sheets',
          scheduler_id: null,
          team_id: 607,
          update_frequency: null,
          update_query: null,
          update_status: null,
          user_id: 5612
        },
        resourceTable: 'Sheet1'
      }
    ];

    const data = await AchoInstance.ResourceEndpoints.queryTableData({ actionQuery });
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('schema');
    expect(data).toHaveProperty('paging');
    expect(data).toHaveProperty('jobId');

    const { data: _data, schema, paging, jobId: _jobId } = data;
    expect(_data.length).toBeLessThanOrEqual(100); // NOTE: default page size is 100 rows
    expect(schema).toHaveProperty('fields');
    // if this is the last page, there won't be a pageToken (a unique string to query the next page)
    if (_data.length < 100) expect(paging).not.toHaveProperty('pageToken');
    else expect(paging).toHaveProperty('pageToken');
  });
});

describe('test resource:sync', () => {});
