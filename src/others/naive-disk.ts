import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import { stream } from 'exceljs';
import * as Excel from 'exceljs';
import { EventEmitter, PassThrough, Stream } from 'stream';
import fs, { WriteStream } from 'fs';

import * as util from 'util';
import { once } from 'events';
import * as process from 'process';
// import * as csv from 'csv';
import * as csv from '@fast-csv/format';
import { ReadableStream } from 'memory-streams';
import crypto from 'crypto';

function writeStreamToDisk(readableStream:ReadableStream) {
  // const writableStream = new Stream.PassThrough();
  // writeStream.pipe(process.stdout);
  const writableStream = fs.createWriteStream('out.txt');
  writableStream.on('finish', () => {
    console.log('wrote all data to file');
  });

  readableStream.on('data', (chunk) => {
    writableStream.write(chunk);
    // console.log(`Writing to Disk ${chunk.length}`);
  });
}

async function generateDataToStream(writeStream:any) {
  let counter = 10000;
  do {
    if (!writeStream.write(`${counter} ${makeid(1024)}\n`)) {
      await once(writeStream, 'drain');
    }
    if (counter % 2000 === 0) {
      console.log('Writing to Stream 2000 lines');
      // mem();
      //
    }
    counter -= 1;
  } while (counter > 0);
  writeStream.end();
}

const main = async () => {
  const writableStream = new Stream.PassThrough();
  writeStreamToDisk(writableStream);
  generateDataToStream(writableStream);

  writableStream.on('close', () => {
    fs.readFile('out.txt', (err, data) => {
      const checksum = generateChecksum(data.toString());
      if (checksum !== 'd41d8cd98f00b204e9800998ecf8427e') {
        console.log('generated file KO', checksum);
      } else {
        console.log('generated file ok', checksum);
      }
    });
  });
};

main();

// generateAndPushDisk();

// console.log(writeStream);

// fs.writeFile('out.xls', writeStream.read(1000), (err) => {
//     // throws an error, you could also catch it here
//     if (err) throw err;

//     // success case, the file was saved
//     console.log('Lyric saved!');
// });
function mem() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory usage : ${used} MB`);
}

function makeid(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const generateChecksum = (str:string) => crypto
  .createHash('md5')
  .update(str, 'utf8')
  .digest('hex');
