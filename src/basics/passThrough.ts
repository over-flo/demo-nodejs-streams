import { createReadStream, createWriteStream } from 'fs';
import { PassThrough } from 'stream';

const readStream = createReadStream('./data/bigfile.txt');
const writeStream = createWriteStream('./data/bigfile_copy.txt');

const tunnel = new PassThrough();

let amount = 0;
tunnel.on('data', (chunk) => {
  amount += chunk.length;
  process.stdout.write(` bytes: ${amount}\r\n`);
});

readStream.pipe(tunnel).pipe(writeStream);
