import { Writable } from 'stream';

const writable = new Writable();

writable._write = function (chunk, encoding, next) {
  console.log(chunk.toString());
  next();
};

writable.write('Hello');
writable.write('world!');
writable.end();
