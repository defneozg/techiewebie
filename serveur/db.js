const { MongoClient } = require('mongodb');

// Connexion à MongoDB
const connectionDB = (async () => {
    try {
      const client = await MongoClient.connect('mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/techie_webie_db');
      console.log('Connected to MongoDB');

      db = client.db('techie_webie_db');

      return db;

    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); 
    }
  });

  module.exports = { MongoClient, connectionDB };

  