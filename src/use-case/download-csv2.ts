import {
  GetObjectCommand, GetObjectCommandOutput, S3, S3Client,
} from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import * as es from 'event-stream';
import { Readable } from 'stream';

dotenv.config();

class ReadableS3 extends Readable {
  filename :string;

  reader : any | undefined;

  constructor(filename:string) {
    super();
    this.filename = filename;
  }

  async init() {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: `${process.env.S3_PREFIX}/${this.filename}`,
    });
    const s3Client = new S3Client({
      region: process.env.AWS_DEFAULT_REGION,
      forcePathStyle: true,
    });
    const item = await s3Client.send(command);
    if (item.Body) {
      const readableStream = await item.Body.transformToWebStream() as ReadableStream<Uint8Array>;
      this.reader = readableStream.getReader();
    }
  }

  async _read() {
    const chunk = await this.reader.read();
    const te = new TextDecoder();
    if (!chunk.done) {
      //this.push(` <Chunk> ${te.decode(chunk.value)} </Chunk> `);
      this.push(`${te.decode(chunk.value)}`);
    } else {
      this.push(null);
    }
  }
}

(async () => {
  const readableS3 = new ReadableS3('test02.csv');
  await readableS3.init();

  readableS3
    .pipe(es.split())
    // .pipe(es.map((line:string, cb :any) => {
    //   cb(null, `${line}`);
    //   return true;
    // }))
    .pipe(es.join('</chunk>\n\n<chunk>'))
    .pipe(process.stdout);
})();
