import { Duplex } from 'stream';
import fs from 'fs';

class LocationObfuscator extends Duplex {
  buffer:string[] = [];

  callback ?: ()=>void = undefined;

  _read(size:number) {
    if (this.buffer.length) {
      this.push(this.buffer.shift());
    } else {
      this.callback = () => {
        this.push(this.buffer.shift());
      };
    }
  }

  _write(chunk: Buffer, encoding: BufferEncoding, callback: () => void) {
    this.buffer.push(chunk.toString().replace('file', '****'));
    if (this.callback) {
      this.callback();
    }
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
