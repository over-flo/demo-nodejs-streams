import { Transform } from 'stream';

const transform = new Transform({
  transform(chunk:Buffer, encoding : BufferEncoding, callback) {
    this.push(chunk.toString().replace(/[1-9]/g, '*'));
    callback();
  },
});
process.stdin.pipe(transform).pipe(process.stdout);
