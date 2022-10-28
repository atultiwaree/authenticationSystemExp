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

  const profile = req.file?.path ? req.file.path : null;
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
    id: userData.length + 1,
  });
  res.send(userData); //Sending user array
});

app.post("/login", (req, res) => {
  for (let i of ["username", "password"])
    if (!req.body[i])
      return res
        .status(400)
        .json({ success: false, message: `Please enter ${i}.` });

  let user = userData.find((x) => x.username == req.body.username);

  if (user) {
    if (verifyPass(req.body.pass, user.pass))
      return res.json({ accessToken: genTok({ id: user.id }) }).status(200);
    else
      return res.status(400).json({
        success: false,
        message: "Pleasee enter valid username and password.",
      });
  } else
    return res.status(400).json({
      success: false,
      message: "Pleasee enter valid username and password.",
    });
});

app.get("/profile", verifyToken, (req, res) => {
  res.status(200);
});

server.listen(3000, (err) => {
  !err
    ? console.log("Server started...")
    : console.log("Sorry there was some problem");
});
