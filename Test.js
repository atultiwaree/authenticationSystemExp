// const fuckedUp = {
//   name: "me",
//   age: 12,
// };

// const loved = {
//   ...fuckedUp,
//   clas: "bca",
// };

// const { name = "fucking shit", age, clas } = loved;

// console.log(clas);

const gen = require("./hashers/genHash");
const ver = require("./hashers/verifyHash");

const hash = gen("atul");

const x = ver("atul", hash);

console.log(x);
