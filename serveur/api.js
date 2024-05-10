const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const Users = require("./entites/users.js");
const Discussions = require("./entites/discussions");
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
  const discussions = new Discussions.default(db);
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
    const { username, password, firstName, lastName, isAdmin, isApproved } =
      req.body;
    if (!username || !password || !lastName || !firstName) {
      res.status(400).send("Missing fields");
    } else {
      users
        .createUser(
          username,
          password,
          firstName,
          lastName,
          isAdmin,
          isApproved
        )
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

      // Check if the user's account is approved
      const isApproved = await users.checkIfUserIsApproved(username);
      console.log("hey", isApproved);
      if (!isApproved) {
        res.status(403).json({
          status: 403,
          message:
            "Your account has not been approved yet. Please wait for approval.",
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
            res.status(200).json({
              status: 200,
              message: "Login and password accepted",
              approve: isApproved,
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
      const newDiscussion = await discussions.insertDiscussion({
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
      const allDiscussions = await discussions.getAllDiscussions();
      res.status(200).json(allDiscussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Error fetching discussions" });
    }
  });

  // DELETE Discussion
  router.delete("/discussions/discussionId/:discussionId", async (req, res) => {
    const { discussionId } = req.params;

    try {
      const discussion = await discussions.findDiscussionById(discussionId);
      if (!discussion) {
        return res.status(404).json({ error: "Discussion not found" });
      }

      // Check if the user is the owner of the discussion or an admin
      // console.log(req.session.username);
      // console.log(discussion.username);
      // if (
      //   discussion.username !== req.session.username &&
      //   !req.session.isAdmin
      // ) {
      //   return res.status(403).json({ error: "Unauthorized" });
      // }

      // Proceed with the deletion
      await discussions.deleteDiscussionById(discussionId);
      res.status(200).json({ message: "Discussion deleted successfully" });
    } catch (error) {
      console.error("Error deleting discussion:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // DELETE Message
  router.delete("/messages/:messageId", async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.session.userid; // Assuming user ID is stored in the session

      // Check if the user is an admin or the owner of the message
      const isAdmin = await users.isAdmin(userId);
      const message = await messages.findMessageById(messageId);
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      if (isAdmin || message.userId === userId) {
        await messages.deleteMessage(messageId);
        res.status(200).json({ message: "Message deleted successfully" });
      } else {
        res.status(403).json({ error: "Unauthorized to delete message" });
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET Discussion par id
  router.get("/discussions/discussionId/:discussionId", async (req, res) => {
    const { discussionId } = req.params;
    try {
      const discussion = await discussions.findDiscussionById(discussionId);
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

  // GET Discussion par username
  router.get("/discussions/username/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const discussion = await discussions.findDiscussionByUsername(username);
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

  // GET Message par username
  router.get("/messages/username/:username", async (req, res) => {
    const { username } = req.params;
    try {
      const message = await messages.findMessageByUsername(username);
      if (!message) {
        res.status(404).json({ error: "Message not found" });
        return;
      }
      res.json(message);
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST discussions - AdminPage
  router.post("/admindiscussions", async (req, res) => {
    try {
      const { title, content, username } = req.body;
      console.log("Creating discussion:", { title, content, username });
      const newDiscussion = discussions.insertAdminDiscussion({
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

  // GET discussions - AdminPage
  router.get("/admindiscussions", async (req, res) => {
    try {
      const adminDiscussions = await discussions.getAllAdminDiscussions();
      res.status(200).json(adminDiscussions);
    } catch (error) {
      console.error("Error fetching discussions:", error);
      res.status(500).json({ message: "Error fetching discussions" });
    }
  });

  // GET Discussion par id - AdminPage
  router.get(
    "/admindiscussions/discussionId/:discussionId",
    async (req, res) => {
      const { discussionId } = req.params;
      try {
        const adminDiscussion = await discussions.findAdminDiscussionById(
          discussionId
        );
        if (!adminDiscussion) {
          res.status(404).json({ error: "Discussion not found" });
          return;
        }
        res.json(adminDiscussion);
      } catch (error) {
        console.error("Error fetching discussion:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

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
      const msg = await messages.getAllMessagesByDiscussionId(discussionId);
      res.json(msg);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET Discussions by search query
  router.get("/search/discussions", async (req, res) => {
    const { search } = req.query;
    try {
      const discussionSearch = await discussions.searchDiscussions(search);
      res.json(discussionSearch);
    } catch (error) {
      console.error("Error searching discussions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET User par id
  /*
  router.get("/user/:userId", async (req, res) => {
    try {
      const user = await users.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });*/

  // GET User par username
  router.get("/user/username/:username", async (req, res) => {
    try {
      const { username } = req.params;
      console.log(username);
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

  // GET pending approvals
  router.get("/user/pending", async (req, res) => {
    try {
      const pendingApprovals = await users.getPendingApprovals();
      res.json(pendingApprovals);
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST approve user
  router.post("/user/approve/:username", async (req, res) => {
    const { username } = req.params;
    try {
      await users.approveUser(username);
      res.status(200).json({ message: "User approved successfully" });
    } catch (error) {
      console.error("Error approving user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // POST endpoint to toggle admin status of a user
  router.post("/users/:username/toggle-admin", async (req, res) => {
    const { username } = req.params;

    try {
      // Retrieve the user from the database
      const user = await users.findByUsername(username);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Toggle the admin status
      if (!user.isAdmin) {
        await users.makeAdmin(username);
      } else {
        await users.removeAdmin(username);
      }

      res.status(200).json({
        message: "Admin status updated successfully",
        isAdmin: user.isAdmin,
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // GET Discussions postées par un user
  /*router.get("/user/:userId/discussions", async (req, res) => {
    try {
      const allDiscussions = await discussions.find({
        userId: req.params.userId,
      });
      res.json(allDiscussions);
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
  });*/

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
