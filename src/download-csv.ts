import { GetObjectCommand, S3, S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import fs from 'fs';
import stream, { Writable } from 'stream';
// const readableStream = await S3.getObject({ Bucket: bucket, Key: filename }).createReadStream();

dotenv.config();

const command = new GetObjectCommand({
  Bucket: process.env.S3_BUCKET,
  Key: `${process.env.S3_PREFIX}/test02.csv`,
});

const s3Client = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  forcePathStyle: true,
});

// const writable = new stream.Writable({
//   write(chunk, encoding, next) {
//     console.log(chunk.toString());
//     next();
//   },
// });

// const stream = new WritableStream({
//   write(chunk) {
//     console.log(chunk);
//   },
// });

// const writable = new Writable();

// writable._write = function (chunk, encoding, next) {
//   console.log(chunk.toString());
//   next();
// };

(async () => {
  const item = await s3Client.send(command);
  // console.log(item);
  if (item.Body) {
    const rs = await item.Body.transformToWebStream() as ReadableStream<Uint8Array>;
    // rs.pipeTo(writable);
    // rs.pipeTo();

    // let ans : {value:}
    let chunk;
    const reader = rs.getReader();
    const te = new TextDecoder();
    do {
      // eslint-disable-next-line no-await-in-loop
      chunk = await reader.read();
      console.log('----------------------------');
      console.log(te.decode(chunk.value));
    } while (!chunk.done);

    // rs.on('data',(chunk)=>console.log(chunk);)
    // .pipe(createWriteStream('fromS3.csv'));
  }
})();
