import * as stream from 'stream';

import * as fs from 'fs';

const readableStream = new stream.Readable({
  read(size) {
    console.log(`somebody read me${size}`);
    return true;
  },
});
readableStream.push('ping!');
readableStream.push('pong!');

async function logChunks(readable: stream.Readable) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    console.log(`i read ${chunk}`);
  }
}

const readable = fs.createReadStream('test.txt', { encoding: 'utf8' });
logChunks(readableStream);

// Output:
// 'This is a test!\n'
