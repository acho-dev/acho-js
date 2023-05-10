<h1 align="center">
   <b>
        <a href="https://acho.io"><img src="https://asset.acho.io/acho-website-assets/home_new/logo-black.png" /></a><br>
    </b>
</h1>

<p align="center">Acho JavaScript SDK for Node.js</p>

<p align="center">
    <a href="https://acho.io"><b>Website </b></a>
</p>

[![npm version](https://img.shields.io/npm/v/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)
[![npm version](https://img.shields.io/node/v/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)
[![npm version](https://img.shields.io/npm/l/@acho-inc/acho-js?style=flat-square)](https://www.npmjs.com/package/@acho-inc/acho-js)

Acho.js 1.4.4

## What is this repository for?

- SDK for Acho Studio API
- 1.4.4

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
$ npm install acho-js
```

If you want to use it as a dependency in your project that needs to be built and deployed

```
$ npm install acho-js --save
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
