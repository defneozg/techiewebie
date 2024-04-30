const { MongoClient } = require("mongodb");
let client;

// Connexion à MongoDB
const connectionDB = async () => {
  try {
    client = await MongoClient.connect("mongodb://localhost:27017");
    console.log("Connected to MongoDB");
    db = client.db("techie_webie_db");
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
