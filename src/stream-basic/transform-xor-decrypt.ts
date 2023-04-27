import { Transform } from 'stream';
import { encrypt, decrypt } from 'xor-cryptor';
import fs from 'fs';

const xorDecrypt = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, decrypt(chunk.toString(), 'secret').decrypted);
  },
});

xorDecrypt.on('data', (chunk) => { console.log(chunk.toString('utf8')); });

fs.createReadStream('./data/encrypted.txt').pipe(xorDecrypt);
