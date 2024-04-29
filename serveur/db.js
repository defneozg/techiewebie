const { MongoClient } = require('mongodb');

//mongodb://localhost:27017

// Connexion à MongoDB
const connectionDB = (async () => {
    try {
      const client = await MongoClient.connect('mongodb://localhost:27017');
      console.log('Connected to MongoDB');

      db = client.db('techie_webie_db');

      return db;

    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); 
    }
  });

  module.exports = { MongoClient, connectionDB };

  