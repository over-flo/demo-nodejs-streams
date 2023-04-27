import { Duplex } from 'stream';
import fs from 'fs';
import { Mutex } from 'async-mutex';

class LocationObfuscator extends Duplex {
  buffer:string[] = [];

  mutex = new Mutex();

  constructor() {
    super();
    this.mutex.acquire();
  }

  async _read(size:number) {
    if (this.buffer.length) {
      this.push(this.buffer.shift());
    } else {
      process.stderr.write('<R wait>');
      await this.mutex.acquire();
      process.stderr.write('<R continue>');
      const char = this.buffer.shift();

      if (char) this.push(Buffer.from(char));
    }
  }

  _write(chunk: any, encoding: any, callback: () => void) {
    [...chunk.toString().replace('file', '****')].forEach((char) => {
      this.buffer.push(char);
    });
    this.mutex.release();
    process.stderr.write('<W release>');

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
