function* idMaker() {
  let index = 0;
  while (index < 3) {
    yield index += 1;
  }
}

const ider = idMaker();

let val = ider.next();
while (!val.done) {
  console.log(val.value);
  val = ider.next();
}
