import fs from 'fs';

let data = '';

const readerStream = fs.createReadStream('data/test.txt');

readerStream.on('data', (chunk) => {
  data += chunk;
});
readerStream.on('end', () => {
  console.log(data);
});
readerStream.on('error', (err) => {
  console.log(err.stack);
});

console.log('Program Ended');
