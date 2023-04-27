import stream, { Writable } from 'stream';
import fs from 'fs';
// const readableStream = new Stream.Readable();
const readableStream = fs.createReadStream('data/test.txt');
// const writableStream = new Stream.Writable();

// class MyWritable extends stream.Writable {
//   // eslint-disable-next-line class-methods-use-this
//   _write(chunk:any, _encoding:string, next:()=>void) {

//     // console.log('never called');
//     // console.log(chunk.toString());
//     // this.emit('data', chunk);

//     // next();
//   }
// }
// const writableStream = new MyWritable();
const writable = new Writable();

writable._write = (chunk, encoding, next) => {
  console.log(chunk.toString());
  next();
};

readableStream.pipe(writable);

// readableStream.push('ping!');
// readableStream.push('pong!');

writable.end();

// readableStream.pipe(process.stdout);

console.log('program End');
