import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
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

const streamToString = (aStream: any) => new Promise((resolve, reject) => {
  const chunks:any[] = [];
  aStream.on('data', (chunk: any) => chunks.push(chunk));
  aStream.on('error', reject);
  aStream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
});

(async () => {
  const reponse = await s3Client.send(command);
  // console.log(item);
  if (reponse.Body) {
    const { Body } = reponse;
    console.log(await streamToString(Body));
  }
})();
