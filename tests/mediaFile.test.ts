import _ from 'lodash';
import fs from 'fs';
import { Acho, streamToBuffer } from '../src/index';
import { Readable } from 'stream';
import exp from 'constants';

describe('test Media File Endpoints', () => {
  const AchoInstance = new Acho({
    apiToken: process.env.ACHO_TOKEN,
    endpoint: process.env.ACHO_API_ENDPOINT ? process.env.ACHO_API_ENDPOINT : 'http://localhost:8888'
  });

  it('get file metadata', async () => {
    const mediaFileInstance = AchoInstance.mediaFile({});
    expect(mediaFileInstance).toBeInstanceOf(Object);

    const resp = await mediaFileInstance.metadata();
    expect(resp).toBeInstanceOf(Object);
    return resp;
  });

  it('get file into buffer', async () => {
    const mediaFileInstance = AchoInstance.mediaFile({});
    expect(mediaFileInstance).toBeInstanceOf(Object);

    const resp: Readable = (await mediaFileInstance.getFileReadStream({ path: 'internal_system_logs.csv' })) as Readable;
    const buffer: Buffer = (await streamToBuffer(resp)) as Buffer;
    expect(buffer).toBeInstanceOf(Buffer);
    return buffer;
  });
});
