const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const genTok = require("./hashers/jwttoken");
const verifyToken = require("./hashers/jwtVerify");
const genHash = require("./hashers/genHash");
const verifyPass = require("./hashers/verifyHash");

const upload = require("./multeria/index");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello");
});

const userData = [];

app.post("/register", upload.single("photo"), (req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const profile = req.file.path;
  const age = req.body.age;
  const pass = genHash(req.body.pass); //Hashed pass
  userData.push({
    //Pushed to array
    created: true,
    username: username,
    name: name,
    photo: profile,
    age: age,
    pass: pass,
  });
  res.send(userData); //Sending user array
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.pass;
  if (userData[0].username === username) {
    if (verifyPass(password, userData[0].pass)) {
      //After verification of username and password generating token
      const name = userData[0].name;
      const age = userData[0].age;
      const photo = userData[0].photo;
      const token = genTok({ name: name, age: age, photo: photo });
      res.json({ accessToken: token }).status(200);
    }
  } else {
    res.send("not correct...").status(401);
  }
});

app.get("/profile", verifyToken, (req, res) => {
  res.status(200);
});

server.listen(3000, (err) => {
  !err
    ? console.log("Server started...")
    : console.log("Sorry there was some problem");
});
