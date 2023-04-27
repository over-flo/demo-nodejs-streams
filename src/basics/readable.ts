import { Readable } from 'stream';

class ReadableCounter extends Readable {
  data = 0;

  _read(size:number) {
    this.data += 1;

    if (this.data <= 6) {
      const chunk = this.data.toString();
      this.push(chunk);
    } else {
      this.push(null);
    }
  }
}

const r = new ReadableCounter();

r.pipe(process.stdout);

// console.log();

// const readable = Readable.from('Good morning!\n', { encoding: 'utf8' });
// readable.pipe(process.stdout);

// const streamToString = (aStream: any) => new Promise((resolve, reject) => {
//   const chunks:any[] = [];
//   aStream.on('data', (chunk: any) => chunks.push(chunk));
//   aStream.on('error', reject);
//   aStream.on('end', () => resolve(chunks));
// });
// (async () => {
//   console.log(await streamToString(readable));
// })();
