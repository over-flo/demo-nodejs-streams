import { Writable } from 'stream';

class EchoStream extends Writable {
  // eslint-disable-next-line class-methods-use-this
  _write(chunk: Buffer, enc: BufferEncoding, callback: () => void) {
    // data written to the stream are redirected to stdout
    process.stdout.write(chunk.toString());
    callback();
  }
}
const writable = new EchoStream();

(async () => {
  const canWrite = await writable.write(Buffer.from('Héllo', 'utf-8'), () => { console.log('[callback1 called]'); });
  console.log(`canWrite: ${canWrite}`);
  if (canWrite)writable.write('world!', () => { console.log('[callback2 called]'); });
  writable.end();
})();
