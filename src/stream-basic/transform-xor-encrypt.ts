import { Transform, TransformCallback } from 'stream';
import { encrypt } from 'xor-cryptor';
import fs from 'fs';

const xorCrypt = new Transform({
  transform(chunk:Buffer, encoding : BufferEncoding, callback:TransformCallback) {
    callback(null, encrypt(chunk.toString(), 'secret').encrypted);
  },
});

fs.createReadStream('./data/to-encrypt.txt').pipe(xorCrypt).pipe(fs.createWriteStream('./data/encrypted.txt'));
