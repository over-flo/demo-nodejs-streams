import { Duplex } from 'stream';
import fs from 'fs';

class LocationObfuscator extends Duplex {
  buffer:string[] = [];

  _read(size:number) {
    if (this.buffer.length) {
      this.push(this.buffer.shift());
    }
  }

  _write(chunk: Buffer, encoding: BufferEncoding, callback: () => void) {
    this.buffer.push(chunk.toString().replace('file', '****'));
    callback();
  }

  _final(callback: (error?: Error | null | undefined) => void): void {
    console.log('<end>');
    callback();
  }
}

const filter = new LocationObfuscator();
const rs = fs.createReadStream('data/test.txt');
rs.pipe(filter).pipe(process.stdout);
