function iterate(...args) {
  let index = 0;
  const iterable = {
    [Symbol.iterator]() {
      return this;
    },
    next() {
      if (index < args.length) {
        return {
          value: args[index += 1],
        };
      }
      return {
        done: true,
      };
    },
  };
  return iterable;
}

for (const x of iterate('foo', 'bar', 'baz')) {
  console.log(x);
  break;
}
