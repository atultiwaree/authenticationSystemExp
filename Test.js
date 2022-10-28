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

// const gen = require("./hashers/genHash");
// const ver = require("./hashers/verifyHash");

// const hash = gen("atul");

// const x = ver("atul", hash);

// console.log(x);

// const userData = require("./userData.json");
// userData.push({ name: "atul" });
// console.log(userData);

// const x = ["atul", "natul", "patul"];

// const y = x.splice(2, 1);

// console.log(x);
// console.log("::::::::::y", y);

const obj = [{ name: "atul" }, { name: "patul" }];

const x = (obj[0].name = "fatul");

console.log(obj);
console.log(x);
