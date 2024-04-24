const { MongoClient } = require('mongodb');

const url = "mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/";
const client = new MongoClient(url);

// Connect to MongoDB (asynchronous)
const connectionDB = (async () => {
    try {
      const client = await MongoClient.connect('mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/techie_webie_db');
      console.log('Connected to MongoDB');
  
      // Use the client for database operations (if needed)
      db = client.db('techie_webie_db'); // Replace with your database name
  
      // Start the server after successful connection
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1); // Exit the application on error
    }
  });

  module.exports = connectionDB;