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

process.env.AWS_PROFILE = 'digi-dev';
// ps.pipe(writeStream);

function sendToS3(writeStream:PassThrough, filename:string) {
  const s3 = new S3({
    region: 'eu-west-1',
    forcePathStyle: true,
  });
  
  const upload = new Upload({
    client: s3,
    queueSize: 1,
    params: {
      Bucket: 'shad0w-wolf-integration-reports-bucket',
      Key: `test-florent/${filename}`,
      Body: writeStream,
    },
  });

  upload.on('httpUploadProgress', (progress) => {
    //mem();
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

// const workbook =  new Excel.stream.xlsx.WorkbookWriter( {
//     filename:"out.xlsx",
//     useStyles: true,
//     useSharedStrings: true,
//   });

function createWorkSheet(workbook:any, title:string) {
  console.log('create Worksheet');
  const worksheet = workbook.addWorksheet(title);
  worksheet.columns = [{ header: 'test', key: 'test', width: 20 }];

  console.log('filling Worksheet', title);
  for (let i = 0; i < 50000; i += 1) {
    worksheet.addRow({ test: `cool${makeid(1024)}` }).commit();

    if (i % 10000 === 0) {
      mem();
      console.log('rows added');
      //
    }
  }
  console.log('commit Worksheet');
  worksheet.commit();
}

async function createExcel(writeStream:any) {
  // const workbook =  new Excel.Workbook();
  // workbook.xlsx.writeFile("test.xlsx");

  const workbook = new Excel.stream.xlsx.WorkbookWriter({
    // filename:"test.xlsx",
    useStyles: false,
    useSharedStrings: false,
    stream: writeStream,
  });
  createWorkSheet(workbook, 'test1');
  // createWokSheet(workbook,"test2",writeStream);
  mem();
  console.log('Workbook committing');
  workbook.commit().then(() => {
    mem();
    writeStream.end();
  });
}

function debugReadStream() {
  // writeStream.on('data',()=>{
  //     console.log('DATA RECEIVED')
  // })

  // writeStream.on('readable', function() {
  //     while ((writeStream.read()) != null) {
  //         console.log("READABLE RECEIVED");
  //     }
  // });

  // let writeStream = fs.createWriteStream('out.xlsx');
  // writeStream.on('finish', () => {
  //     console.log('wrote all data to file');
  // });
}

async function generateAndPushS3() {
  const writeStream = new Stream.PassThrough();
  // debugReadStream();
  sendToS3(writeStream, 'out.csv');

  createSimpleCsv(writeStream, () => {
    writeStream.end();
  });
  // OR
  // await createSimpleFile(writeStream);
}

generateAndPushS3();
/// ///////////////////////

// function generateAndPushDisk(){
//     const writeStream = new Stream.PassThrough();
//     //writeStream.pipe(process.stdout);
//     //let writeStream = fs.createWriteStream('out.txt');
//     writeStream.on('finish', () => {
//         console.log('wrote all data to file');
//     });

//     sendToS3(writeStream);

//     createSimpleFile(writeStream);

// }

async function createSimpleCsv(writeStream:any, onEnd:any) {
  let counter = 50000;
  const csvStream = csv.format({ headers: true });
  csvStream.pipe(writeStream).on('end', () => onEnd());
  do {
    csvStream.write({ key: counter, value: makeid(1024) });
    // if (!csvStream.write({ key: counter, value: makeid(1024) })) {
    //   await once(writeStream, 'drain');
    // }

    // if(!writeStream.write(counter+" "+makeid(1024)+'\n')){
    //    await once(writeStream,'drain');
    // }
    if (counter % 10000 === 0) {
      console.log('10000 were written');
      // mem();
    }
    counter -= 1;
  } while (counter > 0);
  csvStream.end();
}

async function createSimpleFile(writeStream:any) {
  let counter = 10000;
  do {
    if (!writeStream.write(`${counter} ${makeid(1024)}\n`)) {
      await once(writeStream, 'drain');
    }
    if (counter % 10000 === 0) {
      console.log('Writing to Stream 10000 lines');
      // mem();
      //
    }
    counter -= 1;
  } while (counter > 0);
  writeStream.end();
}

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
