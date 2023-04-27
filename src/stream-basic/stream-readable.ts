import { Stream } from 'stream';

const readableStream = new Stream.Readable();

readableStream._read = () => {
  this.push('ping!');
};
readableStream.push('ping!');
readableStream.push('pong!');

readableStream.pipe(process.stdout);
