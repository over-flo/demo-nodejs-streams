import { Readable } from 'stream';

/**
 * @param chunkIterable An asynchronous or synchronous iterable
 * over “chunks” (arbitrary strings)
 * @returns An asynchronous iterable over “lines”
 * (strings with at most one newline that always appears at the end)
 */
async function* chunksToLines(chunkIterable: Readable) {
  let previous = '';
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of chunkIterable) {
    let startSearch = previous.length;
    previous += chunk;
    while (true) {
      const eolIndex = previous.indexOf('\n', startSearch);
      if (eolIndex < 0) break;
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
      startSearch = 0;
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}

async function* chunksToChunks(chunkIterable: Readable) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const chunk of chunkIterable) {
    // eslint-disable-next-line no-restricted-syntax
    for (const val of chunk.split('\n')) {
      yield val;
    }
  }
}

async function* numberLines(lineIterable: AsyncGenerator<string, void, unknown>) {
  let lineNumber = 1;
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of lineIterable) {
    yield `${lineNumber} ${line}`;
    lineNumber += 1;
  }
}

async function logLines(lineIterable: AsyncGenerator<string, void, unknown>) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const line of lineIterable) {
    console.log(line);
  }
}

const chunks = Readable.from(
  'Text with\nmultiple\nlines.\n',
  { encoding: 'utf8' },
);
logLines(numberLines(chunksToChunks(chunks)));
