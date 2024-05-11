const { getClient, connectionDB } = require("./db.js");
const express = require("express");
const api = require("./api.js");
const cors = require("cors");

const app = express();
const db = connectionDB();

// Middlewares (express et Cors)
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// Routage
app.use("/api", api.default(db));

// CODE QUI DÉFINIT LE SERVEUR

/*const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.use(bodyParser.json());

const init_disc = require("./data/discussions");
const init_usrs = require("./data/users");
const init_admindisc = require("./data/admindiscussions");

const users = db.collection("users");
const discussions = db.collection("discussions");
const admindiscussions = db.collection("discussionsAdmin");

async function init() {
  try {
    await client.connect();

    // populate database

    if ((await discussions.countDocuments()) !== 0) return;

    var usr_id_dict = {};
    for (const element of init_usrs) {
      const res = await users.insertOne({
        username: element.username,
        password: await bcrypt.hash(element.password, 10),
        firstName: element.firstName,
        lastName: element.lastName,
        isAdmin: element.isAdmin,
        isApproved: element.isApproved,
      });
      usr_id_dict[element.id] = res.insertedId;
    }

    const disc_id_dict = {};
    for (const disc of init_disc) {
      const res = await forums.insertOne({
        title: disc.title,
        content: disc.content,
        username: disc.username,
      });
      disc_id_dict[disc.id] = res.insertedId;
    }

    const admindisc_id_dict = {};
    for (const admindisc of init_admindisc) {
      const res = await forums.insertOne({
        title: admindisc.title,
        content: admindisc.content,
        username: admindisc.username,
      });
      admindisc_id_dict[admindisc.id] = res.insertedId;
    }
    console.log("Populated Database");
  } catch (e) {
    console.error(e);
  }
}

init();*/

// Gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (process.env.NODE_ENV === "development") {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(err.status || 500).send("Internal Server Error");
  }
});

// Fermeture de MongoDB
process.on("SIGINT", async () => {
  try {
    const client = getClient();
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing the MongoDB connection:", error);
  } finally {
    process.exit(0);
  }
});

process.on("SIGTERM", async () => {
  try {
    const client = getClient();
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing the MongoDB connection:", error);
  } finally {
    process.exit(0);
  }
});

module.exports = app;
