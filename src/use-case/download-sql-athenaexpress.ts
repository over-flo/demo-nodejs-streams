TODO :https://stackoverflow.com/questions/52785580/read-a-file-line-by-line-using-lambda-s3
import AWS from 'aws-sdk';
import { AthenaExpress } from 'athena-express';

import * as dotenv from 'dotenv';
import { isTemplateSpan } from 'typescript';

dotenv.config();

const awsCredentials = {
  region: process.env.AWS_DEFAULT_REGION,
};

AWS.config.update(awsCredentials);

const athenaExpressConfig = {
  aws: AWS,
  s3: `s3://${process.env.S3_BUCKET}/test/athena`,
  getStats: true,
};

const athenaExpress = new AthenaExpress(athenaExpressConfig);

(async () => {
  const myQuery = {
    sql: "select *        from deviation_capa        where site = 'Frankfurt R&D SQO' limit 1000",
    db: 'uat-phenix-business-data',
    pagination: 100,

  };

  const final_result = [];
  try {
    let results;
    console.log('1rt call');
    mem();
    results = await athenaExpress.query(myQuery);

    final_result.push(results.Items);
    while (results.QueryExecutionId) {
      console.log('looping');
      mem();
      // eslint-disable-next-line no-await-in-loop
      results = await athenaExpress.query(results.QueryExecutionId);

      final_result.push(results.Items);
    }
  } catch (error) {
    console.log(error);
  }
})();

function mem() {
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Memory usage : ${used} MB`);
}
