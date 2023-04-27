import gzip from 'zlib';
import fs from 'fs';
import { PassThrough, Transform } from 'stream';
import { memoryUsage } from 'process';

const gzipper = gzip.createGzip();

// truncate -s 1000M data/100Mfile.txt

const inp = fs.createReadStream('data/300Mfile.txt');
const out = fs.createWriteStream('data/300Mfile.txt.gz');

const throttling = new Transform({
  transform(chunk: any, encoding: any, callback: () => void) {
    this.push(chunk);
    setTimeout(callback, 1000);
  },
});

const tunnel = new PassThrough();
let amount = 0;
tunnel.on('data', (chunk) => {
  amount += chunk.length;
  process.stdout.write(` bytes: ${amount}\r\n`);
  mem();
});

inp.pipe(throttling).pipe(tunnel).pipe(out);
function mem() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory usage : ${used} MB`);
}
