const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Users = require("./entites/users.js");
const Discussion = require("./entites/discussions");
const AdminDiscussion = require("./entites/adminDiscussions.js");
const Messages = require("./entites/messages.js");

function init(db) {
  const router = express.Router();

  const store = new MongoDBStore({
    uri: "mongodb://localhost:27017/techie_webie_db",
    collection: "sessions",
  });

  store.on("error", function (error) {
    console.error("Session store error:", error);
  });

  const users = new Users.default(db);
  const messages = new Messages.default(db);

  // Middleware session
  router.use(
    session({
      secret: "i_luv_techie_webie",
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 24h
      },
    })
  );

  router.use(express.json());

  router.use((req, res, next) => {
    console.log("API: method %s, path %s", req.method, req.path);
    console.log("Body", req.body);
    next();
  });

  // POST Inscription
  router.post("/user/register", (req, res) => {
    const { username, password, firstName, lastName, isAdmin } = req.body;
    if (!username || !password || !lastName || !firstName) {
      res.status(400).send("Missing fields");
    } else {
      users
        .createUser(username, password, firstName, lastName, isAdmin)
        .then((user_id) => res.status(201).send({ id: user_id }))
        .catch((err) => res.status(500).send(err));
    }
  });

  // POST Connexion
  router.post("/user/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({
          status: 400,
          message: "Invalid request: login and password are required",
        });
        return;
      }

      if (!(await users.exists(username))) {
        res.status(401).json({
          status: 401,
          message: "Unknown user",
        });
        return;
      }

      let userId = await users.checkpassword(username, password);
      if (userId) {
        req.session.regenerate(function (err) {
          if (err) {
            res.status(500).json({
              status: 500,
              message: "Internal error",
            });
          } else {
            req.session.userid = userId;
            console.log(req.session.userid);
            res.status(200).json({
              status: 200,
              message: "Login and password accepted",
            });
          }
        });
        return;
      }
      req.session.destroy((err) => {});
      res.status(403).json({
        status: 403,
        message: "Invalid login and/or password",
      });
      return;
    } catch (e) {
      res.status(500).json({
        status: 500,
        message: "Internal error",
        details: (e || "Unknown error").toString(),
      });
    }
  });

  // GET Statut admin
  router.get("/user/admin", async (req, res) => {
    try {
      if (!req.session || !req.session.userid) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const isAdmin = await users.isAdmin(req.session.userid);
      res.json({ isAdmin });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST Discussion
  router.post("/discussions", async (req, res) => {
    try {
      const { title, content, username } = req.body;
      console.log("Creating discussion:", { title, content, username });
      const newDiscussion = await Discussion.insertDiscussion({
        title,
        content,
        username,
      });
      res.status(201).json(newDiscussion);
    } catch (error) {
      console.error("Error creating discussion:", error);
      res.status(500).json({ message: "Error creating discussion" });
    }
  });

  // GET Discussions
  router.get("/discussions", async (req, res) => {
    try {
      const discussions = await Discussion.getAllDiscussions();
      res.status(200).json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Error fetching discussions" });
    }
  });

  // GET Discussion par id
  router.get("/discussions/:discussionId", async (req, res) => {
    const { discussionId } = req.params;
    try {
      const discussion = await Discussion.findDiscussionById(discussionId);
      if (!discussion) {
        res.status(404).json({ error: "Discussion not found" });
        return;
      }
      res.json(discussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST discussions - AdminPage
  router.post("/admindiscussions", async (req, res) => {
    try {
      const admindiscussion = req.body; // Assuming the request body contains title and content fields
      console.log("Creating discussion:", admindiscussion);
      const newDiscussion = await AdminDiscussion.insertAdminDiscussion(
        admindiscussion
      );
      res.status(201).json(newDiscussion);
    } catch (error) {
      console.error("Error creating discussion:", error);
      res.status(500).json({ message: "Error creating discussion" });
    }
  });

  // GET discussions - AdminPage
  router.get("/admindiscussions", async (req, res) => {
    try {
      const admindiscussions = await AdminDiscussion.getAllAdminDiscussions();
      res.status(200).json(admindiscussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Error fetching discussions" });
    }
  });

  // GET Discussion par id - AdminPage
  router.get("/admindiscussions/:discussionId", async (req, res) => {
    const { discussionId } = req.params;
    try {
      const admindiscussion = await AdminDiscussion.findAdminDiscussionById(
        discussionId
      );
      if (!admindiscussion) {
        res.status(404).json({ error: "Discussion not found" });
        return;
      }
      res.json(admindiscussion);
    } catch (error) {
      console.error("Error fetching discussion:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST messages
  router.post("/messages", async (req, res) => {
    const { discussionId, msg, username } = req.body;
    try {
      const newMessage = await messages.insertMessage({
        discussionId,
        msg,
        username,
      });
      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET messages
  router.get("/messages", async (req, res) => {
    const { discussionId } = req.query;
    try {
      const messages = await messages.getAllMessagesByDiscussionId(
        discussionId
      );
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET User par id
  router.get("/user/:userId", async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET User par username
  router.get("/user/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const user = await users.findByUsername(username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET Discussions postées par un user
  router.get("/user/:userId/discussions", async (req, res) => {
    try {
      const discussions = await Discussion.find({ userId: req.params.userId });
      res.json(discussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET Messages postés par un user
  router.get("/user/:userId/messages", async (req, res) => {
    try {
      const messages = await messages.find({ userId: req.params.userId });
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // A voir si on le garde
  router
    .route("/user/:user_id(\\d+)")
    .get(async (req, res) => {
      try {
        const user = await users.get(req.params.user_id);
        if (!user) res.sendStatus(404);
        else res.send(user);
      } catch (e) {
        res.status(500).send(e);
      }
    })
    .delete((req, res, next) => res.send(`delete user ${req.params.user_id}`));

  return router;
}

exports.default = init;
