const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { v4: uuid } = require("uuid");
const path = require("path");
const pool = require("./database");
const _ = require("lodash");
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

// Routes for User Authentication and Session Management (total: 4)

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
    await pool.query("INSERT INTO users VALUES ($1, $2, $3)", [
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

// Routes for Saving and Accessing Recipes

app.post("/user/group", async (req, res) => {
  try {
    console.log("Start adding Group...");
    const groupId = uuid();
    const groupName = req.body.groupName;
    const userId = req.body.userId;
    console.log("Inserting new group...");
    await pool.query("INSERT INTO groups VALUES ($1, $2, $3)", [
      groupId,
      groupName,
      userId,
    ]);
    const response = { groupId: groupId, groupName: groupName, userId: userId };
    res.json(response);
    res.sendStatus(200);
  } catch (err) {
    res.statusMessage = err.message;
    res.status(400).end();
  }
});

app.post("/recipe", async (req, res) => {
  try {
    console.log("Start adding Group...");
    const recipeLocalId = uuid();
    const recipeId = req.body.recipeId;
    const title = req.body.title;
    const image = req.body.image;
    console.log("Inserting new recipe...");

    const query = `INSERT INTO recipe (recipe_local_id, recipe_id, title, image) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT recipe_id FROM recipe WHERE recipe_id = $2)`;

    await pool.query(query, [recipeLocalId, recipeId, title, image]);

    const response = {
      recipeId: recipeId,
      title: title,
      image: image,
    };
    res.json(response);
    res.sendStatus(200);
  } catch (err) {
    res.statusMessage = err.message;
    res.status(400).end();
  }
});

app.post("/recipeGroup", async (req, res) => {
  try {
    console.log("Start adding recipe to group...");
    const recipeId = req.body.recipeId;
    const groupId = req.body.groupId;
    const userId = req.body.userId;

    console.log("Inserting new recipe group...");

    const query = `INSERT INTO recipe_groups (recipe_local_id, group_id) SELECT recipe.recipe_local_id, groups.group_id FROM recipe INNER JOIN groups ON groups.group_id = $2 AND groups.user_id = $3 INNER JOIN users ON users.user_id = $3 WHERE recipe.recipe_id = $1`;

    await pool.query(query, [recipeId, groupId, userId]);

    const response = {
      recipeId: recipeId,
      groupId: groupId,
    };

    res.json(response);
    res.sendStatus(200);
  } catch (err) {
    res.statusMessage = err.message;
    res.status(400).end();
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = `SELECT username FROM users WHERE user_id = $1`;

    const response = await pool.query(query, [id]);

    res.json(response.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/users/:userId/groups/:groupId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const groupId = req.params.groupId;
    console.log(groupId);

    const query = `SELECT r.* FROM recipe r JOIN recipe_groups rg ON r.recipe_local_id = rg.recipe_local_id JOIN groups g ON g.group_id = rg.group_id WHERE g.user_id = $1 AND g.group_id = $2`;

    const response = await pool.query(query, [userId, groupId]);
    res.json(response.rows);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

app.get(
  "/users/:userId/groups/:groupId/recipe/:recipeTitle",
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const groupId = req.params.groupId;
      const recipeTitle = req.params.recipeTitle;
      const title = recipeTitle.split("&").join(" ");
      console.log(title);

      const query = `SELECT r.recipe_local_id, r.recipe_id, r.title, r.image FROM recipe r JOIN recipe_groups rg ON r.recipe_local_id = rg.recipe_local_id JOIN groups g ON rg.group_id = g.group_id JOIN users u ON g.user_id = u.user_id WHERE u.user_id = $1 AND g.group_id = $2 AND r.title = $3;
`;

      const response = await pool.query(query, [userId, groupId, title]);
      res.json(response.rows[0]);
    } catch (err) {
      console.log(err.message);
      res.status(400).send(err.message);
    }
  }
);

app.get("/users/:userId/recipe/:recipeTitle", async (req, res) => {
  try {
    const userId = req.params.userId;
    const recipeTitle = req.params.recipeTitle;
    const title = recipeTitle.split("&").join(" ");
    console.log(title);

    const query = `SELECT recipe.* FROM recipe JOIN recipe_groups rg ON recipe.recipe_local_id = rg.recipe_local_id JOIN groups g ON rg.group_id = g.group_id WHERE recipe.title = $2 AND g.user_id = $1;
`;

    const response = await pool.query(query, [userId, title]);

    res.json(response.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/users/:userId/randomRecipe", async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `SELECT recipe.* FROM recipe INNER JOIN recipe_groups AS rg ON recipe.recipe_local_id = rg.recipe_local_id INNER JOIN groups AS g ON rg.group_id = g.group_id WHERE g.user_id = $1`;

    const recipeList = await pool.query(query, [userId]);
    const response = _.sample(recipeList.rows);

    res.json(response);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/users/:userId/group/:groupName", async (req, res) => {
  try {
    const userId = req.params.userId;
    const groupName = req.params.groupName;
    const name = groupName.split("&").join(" ");

    const query = `SELECT group_id FROM groups WHERE user_id = $1 AND group_name = $2;`;

    const response = await pool.query(query, [userId, name]);

    res.json(response.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

app.get("/users/:userId/groups", async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `SELECT group_id, group_name FROM groups WHERE user_id = $1;`;

    const response = await pool.query(query, [userId]);

    res.json(response.rows);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(err.message);
  }
});

// Dummy Route for testing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(PORT, () => console.log("Server started."));
