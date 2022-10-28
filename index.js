const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const genTok = require("./hashers/jwttoken");
const verifyToken = require("./hashers/jwtVerify");
const genHash = require("./hashers/genHash");
const verifyPass = require("./hashers/verifyHash");
const userData = require("./userData.json");
const upload = require("./multeria/index");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", upload.single("photo"), (req, res) => {
  if (userData.findIndex((x) => x.username === req.body.username) >= 0)
    return res.json({ success: false, msg: "User already exist" }).status(400);

  const sumData = {
    ...req.body,
    profile: req.file.path,
    pass: genHash(req.body.pass),
    id: userData.length + 1,
    blocked: false,
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
  //If token is valid and returned id now have to check if user exist on dummy db or not---Used res.locals to middleware so as to pass that particular data to this controller--Then we can verify that user to our global userJson object...
  if (res.locals.userId) {
    const userDetIndx = userData.findIndex(
      (x) => x.id === Number(res.locals.userId)
    );

    if (userDetIndx >= 0) {
      const { username, name, age, profile, blocked } = userData[userDetIndx];

      if (blocked)
        return res.json({ success: false, res: "Access denied" }).status(200);

      return res.json({
        success: true,
        userDetails: { username, name, age, profile },
      });
    } else {
      return res.json({ success: false, res: "Internal account error" });
      //May be data was not pushed
    }
  } else {
    return res.json({ success: false, res: "Invalid user" }).res.json(400);
    //token was correct but what if there was no Id
  }
});

app.put("/block", (req, res) => {
  const { id, block } = req.body;
  const idIndex = userData.findIndex((x) => x.id === Number(id));
  if (idIndex >= 0) {
    if (block === true || block === false) {
      const blockedUser = (userData[idIndex].blocked = block);
      blockedUser
        ? res.json({ success: true, block: block }).status(200)
        : res.json({ success: true, block: "unblocked" });
    } else {
      return res
        .json({ success: false, res: "block accept only true or false" })
        .status(400);
    }
  } else {
    return res.json({ success: false, res: "No such user to block" });
  }
});

server.listen(3000, (err) => {
  !err
    ? console.log("Server started...")
    : console.log("Sorry there was some problem");
});
