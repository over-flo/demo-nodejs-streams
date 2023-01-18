// import * as stream from 'stream';
import * as fs from 'fs';
import assert from 'assert';
import { Readable } from 'stream';

function readableToString(readable: any) {
  return new Promise((resolve, reject) => {
    let data = '';
    readable.on('data', (chunk: string) => {
      data += chunk;
    });
    readable.on('end', () => {
      resolve(data);
    });
    readable.on('error', (err: any) => {
      reject(err);
    });
  });
}

async function readableToString2(readable: any) {
  let data = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    data += chunk;
  }
  return data;
}

// const readableStream = new stream.Readable();
// readableStream.push('ping!');
// readableStream.push('pong!');

const createReadStream1 = fs.createReadStream('test.txt', { encoding: 'utf8' });
const createReadStream2 = fs.createReadStream('test.txt', { encoding: 'utf8' });

const readableStream1 = Readable.from('This is a test!\n', { encoding: 'utf8' });
const readableStream2 = Readable.from('This is a test!\n', { encoding: 'utf8' });

(async () => {
  assert.strictEqual(await readableToString(createReadStream1), 'This is a test!\n');
  assert.strictEqual(await readableToString2(createReadStream2), 'This is a test!\n');
  assert.strictEqual(await readableToString(readableStream1), 'This is a test!\n');
  assert.strictEqual(await readableToString2(readableStream2), 'This is a test!\n');
  console.log('end in async');
})();
