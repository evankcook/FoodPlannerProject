const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { v4: uuid } = require("uuid");
const path = require("path");
const pool = require("./database");
const app = express();

const THREE_MINUTES = 1000 * 60 * 3;

const {
  PORT = 8080,
  NODE_ENV = "development",
  SESS_NAME = "sid",
  SESS_SECRET = "asecret....",
  SESS_LIFETIME = THREE_MINUTES,
} = process.env;

const IN_PROD = NODE_ENV === "production";

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: IN_PROD ? "none" : true,
      secure: IN_PROD,
      httpOnly: true,
    },
  })
);

app.get("/loginState", (req, res) => {
  try {
    let response = { isLoggedIn: false };
    console.log(req.session.userId);
    if (req.session.userId) {
      response = { isLoggedIn: true, userId: req.session.userId };
    }
    res.json(response);
    res.sendStatus(200);
  } catch (err) {
    res.statusMessage = err.message;
    res.status(500).end();
  }
});

app.post("/login", async (req, res) => {
  try {
    console.log("Start Login");
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);

    if (username && password) {
      console.log("Verifying user...");
      const user = await pool.query(
        "SELECT user_id, username, password FROM users WHERE username = ($1)",
        [username]
      );
      const resUserId = user.rows[0].user_id;
      const resUsername = user.rows[0].username;
      const resPassword = user.rows[0].password;
      if (resUsername !== username || resPassword !== password) {
        res.statusMessage = "Username or password does not exist.";
        res.status(401).end();
      }
      req.session.userId = resUserId;
      req.session.save();
      const response = { userId: resUserId };
      res.json(response);
      res.sendStatus(200);
    }
  } catch (err) {
    res.statusMessage = err.message;
    res.status(401).end();
  }
});

app.post("/signup", async (req, res) => {
  try {
    console.log("Checking Request...");
    const id = uuid();
    const username = req.body.username;
    const password = req.body.password;
    console.log(`INSERT INTO users VALUES (${id}, ${username}, ${password})`);
    console.log("Inserting new user...");
    const newUser = await pool.query("INSERT INTO users VALUES ($1, $2, $3)", [
      id,
      username,
      password,
    ]);
    req.session.userId = id;
    const response = { userId: id, username: username, password: password };
    res.json(response);
    res.sendStatus(200);
  } catch (err) {
    res.statusMessage = err.message;
    res.status(400).end();
  }
});

app.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.statusMessage = "Could not logout.";
        res.sendStatus(500);
      }

      res.clearCookie(SESS_NAME);
      res.statusMessage = "Logout successful.";
      res.sendStatus(200);
    });
  } catch {
    res.statusMessage = "Could not logout.";
    res.sendStatus(500);
  }
});

app.get("/user/:userId/favorites");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(PORT, () => console.log("Server started."));
