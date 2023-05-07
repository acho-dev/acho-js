# README

Acho.js 1.4.1

## What is this repository for?

- SDK for Acho Studio API
- 1.4.1

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
