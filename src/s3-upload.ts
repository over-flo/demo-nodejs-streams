import { S3 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import * as csv from '@fast-csv/format';
import * as dotenv from 'dotenv';
import { PassThrough, Stream } from 'stream';
import { once } from 'events';

dotenv.config();

function sendToS3(writeStream:PassThrough, filename:string) {
  const s3 = new S3({
    region: process.env.AWS_DEFAULT_REGION,
    forcePathStyle: true,
  });

  const upload = new Upload({
    client: s3,
    queueSize: 1,
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: `${process.env.S3_PREFIX}/${filename}`,
      Body: writeStream,
    },
    partSize: 1024 * 1024 * 5,
  });

  upload.on('httpUploadProgress', (progress) => {
    console.log(`Uploading part ${progress.part} size=${progress.loaded} `);
  });

  upload.done()
    .then((result) => {
      console.log('Upload successfull.', result);
    })
    .catch((err) => {
      console.error(`Failed uploading file : ${err}`);
      throw err;
    });
}

const writeStream = new Stream.PassThrough();
sendToS3(writeStream, 'test01.csv');

createSimpleCsv(writeStream, () => {
  writeStream.end();
});

async function createSimpleCsv(ws: NodeJS.WritableStream, onEnd:()=> void) {
  let counter = 100;
  const csvStream = csv.format({ headers: true });
  csvStream.pipe(ws).on('end', () => onEnd());

  do {
    // csvStream.write({ key: counter, value: makeid(100) });
    if (!csvStream.write({ key: counter, value: makeid(1024) })) {
      await once(writeStream, 'drain');
    }

    if (counter % 10000 === 0) {
      console.log('10000 were written');
      // mem();
    }
    counter -= 1;
  } while (counter > 0);
  csvStream.end();
}

const asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 50000) {

          return Promise.resolve({ done: false });
        }

        return Promise.resolve({ done: true });
      },
    };
  },
};

function makeid(length:number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
