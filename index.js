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
  if (userData.findIndex((x) => x.username === req.body.username) >= 0)
    return res.json({ success: false, msg: "User already exist" }).status(400);

  const sumData = {
    ...req.body,
    profile: req.file.path,
    pass: genHash(req.body.pass),
    id: userData.length + 1,
  };
  const { username, name, profile, age, pass, id } = sumData;
  userData.push({
    name,
    username,
    profile,
    age,
    pass,
    id,
  });
  res.send(userData); //Sending user array
});

app.post("/login", (req, res) => {
  const getInVar = ["username", "pass"];
  for (const elt of getInVar) {
    if (!req.body[elt]) return res.send(`Must provide ${elt}`).status(400);
  }
  const { username, pass } = req.body;
  const index = userData.findIndex((x) => x.username === username);

  if (index >= 0) {
    if (verifyPass(pass, userData[index].pass)) {
      return res
        .json({ passToken: genTok({ id: userData[index].id }) })
        .status(200);
    } else {
      return res
        .json({ success: false, msg: "Password is incorrect" })
        .status(400);
    }
  } else {
    return res
      .json({ success: false, msg: "Username is incorrect" })
      .status(400);
  }
});

//Iske header auth lagana baki hai

app.get("/profile", verifyToken, (req, res) => {
  res.status(200);
});

server.listen(3000, (err) => {
  !err
    ? console.log("Server started...")
    : console.log("Sorry there was some problem");
});
