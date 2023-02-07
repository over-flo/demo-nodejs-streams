import { Readable } from 'stream';

class ReadableCounter extends Readable {
  data = 0;

  _read() {
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
