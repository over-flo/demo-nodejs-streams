import { Writable } from 'stream';

const outStream = new Writable({
  write(chunk, encoding, callback) {
    console.log('chunk received ', chunk.toString());
    callback();
  },
});

process.stdin.pipe(outStream);
