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
