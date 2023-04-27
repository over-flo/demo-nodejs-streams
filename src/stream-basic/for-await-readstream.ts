import * as fs from 'fs';

async function logChunks(readable:any) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of readable) {
    console.log(chunk);
  }
}

const readable = fs.createReadStream('data/test.txt', { encoding: 'utf8' });
logChunks(readable);

readable.pipe(process.stdout);
