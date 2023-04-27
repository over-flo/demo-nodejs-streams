import internal from 'stream';

const iter = {
  [Symbol.iterator]() {
    return {
      current: 0,
      last: 10,

      next() {
        this.current += 1;
        return {
          done: this.current > this.last,
          value: this.current,
        };
      },
    };
  },
};

// iter.forEach((elem) => {
//   console.log(elem);
// });

// eslint-disable-next-line no-restricted-syntax
// for await (const elem of iter) {
//   console.log(elem);
// }

// eslint-disable-next-line no-restricted-syntax
for (const elem of iter) {
  console.log(elem);
}
