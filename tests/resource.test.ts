import { Acho } from '../src/index';
import { ActionQuery, ResourceTableDataResp } from '../src/types';
import { pipeline, Readable, Transform } from 'stream';
import fs from 'fs';
import { ClientRequest } from 'http';

describe.skip('test resource:getTableData', () => {
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

describe.skip('test resource:download', () => {
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

describe.skip('test resource:query', () => {
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

// NOTE: set resource:sync tests timeout to 60000 to override the default 5000ms timeout
describe.skip('test resource:sync', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  test('sync resource table data', async () => {
    const data = await AchoInstance.ResourceEndpoints.syncTableData({ resId: 4651 });
    expect(data).toBe('success');
  }, 60000);

  test('sync resource table data with userId', async () => {
    const data = await AchoInstance.ResourceEndpoints.syncTableData({ resId: 4651, userId: 5612 });
    expect(data).toBe('success');
  }, 60000);
});

describe.skip('test resource:createReadStream', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  test('create read stream with resId', async () => {
    const highWaterMark = 50;
    // NOTE: This seems to allow Axios to complete its housekeeping and be ready to track new connections opened afterwards
    // https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
    await process.nextTick(() => {});
    const readable = await AchoInstance.ResourceEndpoints.createReadStream({ resId: 4678, highWaterMark });
    const t = new Transform({
      writableObjectMode: true, // set this one to true
      readableObjectMode: false,
      writableHighWaterMark: highWaterMark,
      readableHighWaterMark: highWaterMark * 1024,
      transform(chunk, _, done) {
        done(null, `${JSON.stringify(chunk)}\n`);
      }
    });
    const writable = fs.createWriteStream('./tests/data/readstream-test-output');

    await new Promise((resolve, reject) => {
      // Using either pipeline() or readable.pipe().pipe() is fine
      pipeline(readable, t, writable, (err) => {
        if (err) {
          console.error('Pipeline failed.', err);
        } else {
          console.log('Pipeline succeeded.');
        }
      });
      // readable.pipe(t).pipe(writable);
      readable
        .on('end', () => {
          console.log('Written readable stream to file');
          resolve('finished');
        })
        .on('error', (err: any) => {
          reject(err);
        });
    });
    expect(readable).toBeInstanceOf(Readable);
  });

  test('create read stream with a large file', async () => {
    const highWaterMark = 32;
    await process.nextTick(() => {});
    // TEST pipelining large file
    const readable = await AchoInstance.ResourceEndpoints.createReadStream({ resId: 4676, highWaterMark });
    let count = 0;
    readable
      .on('data', () => {
        count++;
      })
      .on('end', () => {
        console.log('Written readable stream to file');
        console.log(count);
      })
      .on('error', (err: any) => {});

    expect(readable).toBeInstanceOf(Readable);
  });

  test('create read stream with assetId', async () => {
    // NOTE: This seems to allow Axios to complete its housekeeping and be ready to track new connections opened afterwards
    // https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
    await process.nextTick(() => {});
    const data = await AchoInstance.ResourceEndpoints.createReadStream({ assetId: 9248 });
    let count = 0;
    data.on('data', () => count++).on('end', () => expect(count).toBe(9994)); // expected value subject to change with the asset
    expect(data).toBeInstanceOf(Readable);
  }, 20000);

  test('create read stream with an integration resource', async () => {
    // res_type = 'integration'
    await process.nextTick(() => {});
    const data = await AchoInstance.ResourceEndpoints.createReadStream({
      assetId: 9249,
      tableId: 'Sheet1'
    });
    // let count = 0;
    // data
    //   .on('data', (data) => {
    //     count++;
    //   })
    //   .on('end', () => {
    //     console.log(count);
    //   });
    expect(data).toBeInstanceOf(Readable);
  });
});

describe('test resource:createWriteStream', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.TOKEN,
    endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
  });

  test('insert rows with resId and csv string', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ resId: 4679, dataType: 'csv', hasHeader: false });
    // TODO: do we have to remove the rows added by test?
    await new Promise((resolve) => {
      for (let i = 0; i < 10; i++) {
        httpRequest.write(`Test_${Date.now()},5000,2020-07-06T13:50:03,2020-07-06T13:50:03\n`);
      }
      httpRequest.end();
      httpRequest.on('response', (res) => {
        res.on('data', (data) => console.log(JSON.parse(data.toString())));
        expect(res.statusCode).toBe(200);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('insert rows with resId and json string', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ resId: 4679, dataType: 'json' });
    await new Promise((resolve) => {
      for (let i = 0; i < 5; i++) {
        httpRequest.write(
          JSON.stringify({
            Name: `JSON_${Date.now()}`,
            Duration: 5000,
            Start_time: '2020-07-06T13:50:03',
            End_time: '2020-07-06T13:50:03'
          }) + '\n'
        );
      }
      httpRequest.end();
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(200);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('insert rows with assetId and json file', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ assetId: 9297, dataType: 'json' });
    await new Promise((resolve) => {
      // NOTE: json should be in newline-delimited format
      fs.createReadStream('./tests/data/res_4679_data.ndjson').pipe(httpRequest);
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(200);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('error handling - wrong credential', async () => {
    const opts = {
      apiToken: 'xxxxxxxx',
      endpoint: process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:8888'
    };
    const AchoInstanceNoAuth = new Acho(opts);

    const httpRequest = AchoInstanceNoAuth.ResourceEndpoints.createWriteStream({ assetId: 9297, dataType: 'json' });
    httpRequest.on('error', (err) => {});
    await new Promise((resolve) => {
      // NOTE: json should be in newline-delimited format
      fs.createReadStream('./tests/data/res_4679_data.ndjson').pipe(httpRequest);
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(401);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('insert rows with assetId and csv file', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ assetId: 9297, dataType: 'csv', hasHeader: true });
    await new Promise((resolve) => {
      // NOTE: json should be in newline-delimited format
      fs.createReadStream('./tests/data/res_4679_data.csv').pipe(httpRequest);
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(200);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('error handling - insert rows with invalid data type', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ resId: 4679, dataType: 'csv', hasHeader: false });
    await new Promise((resolve) => {
      httpRequest.write(`CSV_${Date.now()},AAA,2020-07-06T13:50:03,2020-07-06T13:50:03\n`);
      httpRequest.end();
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(400);
        resolve('done');
      });
      httpRequest.on('error', (error) => {
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test('error handling - insert rows with invalid data format', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ resId: 4679, dataType: 'csv', hasHeader: false });
    await new Promise((resolve) => {
      httpRequest.write(`CSV_${Date.now()},5000,2020-07-06T13:50:03,2020-07-06T13:50:03,aaaa\n`);
      httpRequest.end();
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(400);
        resolve('done');
      });
      httpRequest.on('error', (error) => {
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });

  test.skip('insert rows with with large files', async () => {
    const httpRequest = AchoInstance.ResourceEndpoints.createWriteStream({ assetId: 9297, dataType: 'json', maxWaitTime: 5000 });
    await new Promise((resolve) => {
      // NOTE: json should be in newline-delimited format
      fs.createReadStream('./tests/data/res_4679_data_big').pipe(httpRequest);
      httpRequest.on('response', (res) => {
        expect(res.statusCode).toBe(200);
        resolve('done');
      });
    });
    expect(httpRequest).toBeInstanceOf(ClientRequest);
  });
});
