import { AthenaClient, BatchGetNamedQueryCommand } from '@aws-sdk/client-athena';
import * as dotenv from 'dotenv';
// a client can be shared by different commands.
const client = new AthenaClient({ region: process.env.AWS_DEFAULT_REGION });
dotenv.config();
const params = {
  NamedQueryIds: ['ef1b03d3-4dd0-47d1-9876-3bda4027e005'],
};
const command = new BatchGetNamedQueryCommand(params);

(async () => {
  try {
    const data = await client.send(command);

    console.log(data);
    // process data.
  } catch (error) {
  // error handling.
    console.log(error);
  } finally {
  // finally.

  }
})();
