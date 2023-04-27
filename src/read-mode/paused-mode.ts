import fs from 'fs';

const readableStream = fs.createReadStream('data/test.txt');
let data = '';
let chunk;

readableStream.on('readable', () => {
  // eslint-disable-next-line no-cond-assign
  while ((chunk = readableStream.read()) != null) {
    data += chunk;
  }
});
