const express = require("express");
const cors = require("cors");
const model = require("./model");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static("public"));
app.use(express.json({ limit: "10mb" }));

// const storage = multer.memoryStorage();
// const upload = multer({storage: storage});//last thing i did

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      callback(null, origin);
    },
  })
);

app.use(
  session({
    secret: "jhgfoweriwoerodfkvxcvmxvxm12340fsdfkl32f0y0reofasf",
    saveUninitialized: true,
    resave: false,
  })
);

async function AuthMiddleware(req, res, next) {
  if (req.session && req.session.userID) {
    let user = await model.User.findOne({ _id: req.session.userID });
    if (!user) {
      console.log(user, "You dind't find the user");
      res.status(401).send("Unauthenticated.");
      return;
    }
    req.user = user;
    next();
  } else {
    res.status(401).send("Unauthenticated.");
  }
}

app.post("/session", async function (req, res) {
  try {
    console.log(req.body);
    let user = await model.User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send("Authentication failure.");
      return;
    }
    console.log(user);
    let isGoodPassword = await user.verifyPassword(req.body.password);
    if (!isGoodPassword) {
      res.status(401).send("Authentication failure.");
      return;
    }
    req.session.userID = user._id;
    req.session.name = user.name;
    req.session.email = user.email;
    res.status(201).send(req.session);
  } catch (error) {
    console.log(error);
    res.status(404).send("Not found. (Bad email format?)");
  }
});

app.get("/session", AuthMiddleware, async function (req, res) {
  res.status(200).send(req.session);
  // res.send(req.session);
});

app.post("/users", async function (req, res) {
  try {
    let newUser = await new model.User({
      email: req.body.email,
      name: req.body.name,
      trackedcoins: [],
      // profilepic: req.body.profilepic,
    });

    // set password to hash
    await newUser.setPassword(req.body.password);
    const error = await newUser.validateSync();

    if (error) {
      res.status(422).send(error);
      console.log(error);
      return;
    }

    await newUser.save();

    res.status(201).send("New user created.");
  } catch (error) {
    console.log(error);
    res.status(422).send(error);
  }
});

app.get("/users", async function (req, res) {
  try {
    let users = await model.User.find({}, { password: 0 });
    res.send(users);
  } catch (error) {
    res.status(404).send("Users not found.");
  }
});
app.get("/users/:userID", async function (req, res) {
  try {
    let user = await model.User.findOne(
      { _id: req.params.userID },
      { password: 0 }
    );
    if (!user) {
      res.status(404).send("User not found.");
      return;
    }
    res.send(user);
  } catch (error) {
    res.status(404).send("User not found");
  }
});

// app.put("/users/:userID", AuthMiddleware, async function (req, res) {
//     console.log("PUT /USERS");
//     try {
//       let user = await model.User.findOne({ _id: req.params.userID });
//       if (!user) {
//         res.status(404).send("User not found.");
//         return;
//       }
//       user.email = req.body.email;
//       user.name = req.body.name;
//       if (req.body.password !== user.password)
//         await user.setPassword(req.body.password);

//       const error = await user.validateSync();

//       if (error) {
//         res.status(422).send(error);
//         console.log(error);
//         return;
//       }

//       await user.save();
//       res.status(204).send();
//     } catch (error) {
//       res.status(422).send(error);
//     }
//   });

app.delete("/session", function (req, res) {
  req.session.userID = undefined;
  req.session.name = undefined;
  req.session.email = undefined
  res.status(204).send();
});

app.listen(port, function () {
  console.log(`Server is running on http://localhost:${port}...`);
});
