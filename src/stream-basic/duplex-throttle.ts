import { createReadStream, createWriteStream } from 'fs';

import { PassThrough, Duplex } from 'stream';

const readStream = createReadStream('./data/bigfile.txt');
const writeStream = createWriteStream('./data/bigfile_copy.txt');

class Throttle extends Duplex {
  delay:number;

  constructor(time:number) {
    super();
    this.delay = time;
  }

  _read() {}

  _write(chunk: any, encoding: any, callback: () => void) {
    this.push(chunk);
    setTimeout(callback, this.delay);
  }

  _final() {
    this.push(null);
  }
}

const tunnel = new PassThrough();
const throttle = new Throttle(500);

let amount = 0;
tunnel.on('data', (chunk) => {
  amount += chunk.length;
  process.stdout.write(` bytes: ${amount}\r\n`);
});

readStream.pipe(throttle).pipe(tunnel).pipe(writeStream).on('finished', () => {
  console.log('finished');
});
