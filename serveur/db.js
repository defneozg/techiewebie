const { MongoClient } = require("mongodb");
const fs = require("fs");
let client;

// Connexion à MongoDB
const connectionDB = async () => {
  try {
    client = await MongoClient.connect("mongodb://localhost:27017");
    console.log("Connected to MongoDB");
    db = client.db("techie_webie_db");

    function readJson(fichier) {
      const donnees = fs.readFileSync(fichier);
      return JSON.parse(donnees);
    }

    async function populateBDD(fichierJson) {
      const donnees = readJson(fichierJson);

      const collection = db.collection("users");
      const found = await collection.findOne({
        isAdmin: true,
      });

      if (!found) {
        const usersCollection = db.collection("users");
        await usersCollection.insertMany(donnees.users);

        const discussionsCollection = db.collection("discussions");
        await discussionsCollection.insertMany(donnees.discussions);

        const discussionsAdminCollection = db.collection("discussionsAdmin");
        await discussionsAdminCollection.insertMany(donnees.discussionsAdmin);

        console.log("Base de données MongoDB peuplée avec succès.");
      } else {
        console.log(
          "Il existe déjà un admin. La base de données n'a pas été peuplée."
        );
      }
    }
    populateBDD("./data.json");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const getClient = () => {
  if (!client) {
    console.error(
      "MongoDB client is not initialized. Make sure connectionDB() is called first."
    );
    return null;
  }
  return client;
};

module.exports = { getClient, connectionDB };
