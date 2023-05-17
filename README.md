<h1 align="center">
   <b>
        <a href="https://acho.io"><img src="https://storage.googleapis.com/acho-prod-assets/acho-website-assets/logo/acho_logo_dark.svg" width="360" /></a><br>
    </b>
</h1>

<p align="center">Acho JavaScript SDK for Node.js</p>

<p align="center">
    <a href="https://acho.io"><b>Website </b></a>
</p>

[![npm version](https://img.shields.io/npm/v/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)
[![npm version](https://img.shields.io/node/v/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)
[![npm version](https://img.shields.io/npm/l/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)

## What is this repository for?

- SDK for Acho Studio API

## Features

- Get data from Acho Resource by page
- Run data sync for Acho Resource
- Download data from Acho Resource
- Query Acho Resource for data
- Get Acho Resource Schema
- Create Node.js Readable Stream from Acho Resource
- Create Node.js Writable Stream from Acho Resource
- Get data from Acho Project view
- Get a list of Configured OAuth Client IDs for current organization
- Use an OAuth Client ID to issue a Bearer Token
- Connect to an Acho Published APP's instance
- Join / leave the Acho Published APP instance's socket room
- Send Event to the Acho Published APP instance

## Installing

**Package Manager**

```
$ npm install @acho-inc/acho-js
```

If you want to use it as a dependency in your project that needs to be built and deployed

```
$ npm install @acho-inc/acho-js --save
```

After the package is installed in your **package.json**

```js
import { Acho } from '@acho-inc/acho-js';
```

## Example

**Initializing the Acho Client**

```js
const AchoInstance = new Acho();
```

The SDK will use the environment variables from your system

**_ACHO_TOKEN_**: The Acho develoepr API token

- If you are a current subscriber, retrieve it from your profile page
- If you want to try out the SDK without an active subscription, please [contact us](https://calendly.com/contact_acho/discovery-call)

**_ACHO_API_ENDPOINT_**: The service backend you are connecting to

- Default to https://kube.acho.io
- This setting is irrelevant unless you subscribe to on-premise or dedicated server

If you prefer convenience in testing, you could also initialize the instance by passing in the variables in constructor

```js
const AchoInstance = new Acho({
  apiToken: 'eyEi3oldsi....',
  endpoint: 'https://kube.acho.io'
});
```

> **Note:** It is not recommended to expose your API token in the code base, especially on production\
> We highly recommend dotenv for conveniently modifying environment variables during testing\
> If you suspect your token might be leaked, you can invalidate the token in your profile page, or report to [contact@acho.io](mailto:contact@acho.io)

**Working with Resource Endpoints**

Create a new resource

```js
const resourceResp = await AchoInstance.ResourceEndpoints.create({ name: 'test' });

/* resourceResp: { 
    resId: number,
    assetId: number,
    resource: {
      id: number,
      res_name: string,
      res_display_name: string,
      res_type: 'integration',
      is_ready: 1,
      create_time: unix_timestamp (UTC),
      user_id: number,
      update_time: unix_timestamp (UTC),
      asset_id: number
    }
   }
*/
```

Create a table in a resource

```js
const resourceTableResp = await AchoInstance.ResourceEndpoints.createTable({
  resId: testResId,
  tableName: 'test',
  schema: { col1: 'STRING', col2: 'INTEGER' }
});

/* resourceTableResp: {
    resource: {
      id: number,
      res_name: string,
      ...
    }
    tableName: string
   }
*/
```

Stream data into a table

```js
// JSON flavor
const writableStream = AchoInstance.ResourceEndpoints.createWriteStream({
  resId: testResId,
  tableId: 'test',
  dataType: 'json'
});
const testArray = [
  { col1: 'JSON_1', col2: 1 },
  { col1: 'JSON_2', col2: 2 },
  { col1: 'JSON_3', col2: 3 },
  { col1: 'JSON_4', col2: 4 }
];
await new Promise((resolve) => {
  testArray.forEach((row) => {
    writableStream.write(JSON.stringify(row) + '\n');
  });
  writableStream.end();
  writableStream.on('response', (res) => {
    // expect(res.statusCode).toBe(200);
    resolve('done');
  });
});

// CSV flavor
const writableStream = AchoInstance.ResourceEndpoints.createWriteStream({
  resId: testResId,
  tableId: 'test',
  dataType: 'csv'
});
const testCSV = 'CSV_1,1\nCSV_2,2\nCSV_3,3\nCSV_4,4\n';
await new Promise((resolve) => {
  writableStream.write(testCSV);
  writableStream.end();
  writableStream.on('response', (res) => {
    // expect(res.statusCode).toBe(200);
    resolve('done');
  });
});
```

> **Note:** You can also pipe readable stream into the writableStream created from a resource table\
> The supported formats are CSV and NDJSON.

## Use Cases

**Create a Resource and a table in the Resource, then insert data into the table**

Create a new resource and a resource table first

```js
const createResourceTable = async () => {
  const resourceResp = await AchoInstance.ResourceEndpoints.create({
    name: 'Test Resource'
  });

  const { resId } = resourceResp;

  // please make sure you capture the resId here if you want to do the process in two steps
  console.log(resId);

  const resourceTableResp = await AchoInstance.ResourceEndpoints.createTable({
    resId: resId,
    tableName: 'Test Table',
    schema: { name: 'STRING', age: 'INTEGER' }
  });
};
```

Write data to the resource table (in this example we are using JSON)

```js
const writeData = async () => {
  const writableStream = AchoInstance.ResourceEndpoints.createWriteStream({
    // replace 1234 with the id you captured earlier
    resId: 1234,
    tableId: 'Test Table',
    dataType: 'json'
  });
  const testArray = [
    { name: 'Adam', age: 28 },
    { name: 'Dan', age: 33 },
    { name: 'Jason', age: 35 },
    { name: 'Zach', age: 40 }
  ];
  await new Promise((resolve) => {
    testArray.forEach((row) => {
      writableStream.write(JSON.stringify(row) + '\n');
    });
    writableStream.end();
    writableStream.on('response', (res) => {
      resolve('done');
    });
  });
};
```

After finishing the previous steps, if you add "Test Table" from Resource "Test Resource" to a Project on Acho, here is what you will get.

<img src="
https://storage.googleapis.com/acho-prod-assets/sdk/write_data_example_result.png" width="360" style="padding-left: 48px"/>
