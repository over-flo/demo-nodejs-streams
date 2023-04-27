import { createReadStream, createWriteStream } from 'fs';

import { PassThrough, Transform } from 'stream';

const readStream = createReadStream('./data/bigfile.txt');
const writeStream = createWriteStream('./data/bigfile_copy.txt');

const throttle = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk);
    setTimeout(callback, 500);
  },
});

const tunnel = new PassThrough();

let amount = 0;
tunnel.on('data', (chunk) => {
  amount += chunk.length;
  process.stdout.write(` bytes: ${amount}\r\n`);
});

readStream.pipe(throttle).pipe(tunnel).pipe(writeStream).on('finished', () => {
  console.log('finished');
});
