const { MongoClient } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/techie_webie_db"; 

// Database Name
const dbName = 'techie_webie_db';

// Collection Name
const collectionName = 'discussions';

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to insert a new discussion
async function insertDiscussion(discussion) {
  try {
    // Validate discussion data
    if (!discussion.title || !discussion.content) {
      throw new Error('Discussion title and body are required.');
    }
    // Add createdAt field if not provided
    if (!discussion.createdAt) {
      discussion.createdAt = new Date();
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert discussion into the collection
    const result = await collection.insertOne(discussion);
    console.log(result);
    return result.insertedId;
  } catch (error) {
    // Handle errors
    console.error('Error inserting discussion:', error.message);
    throw error; // Rethrow the error for the caller to handle
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

module.exports = { insertDiscussion };
