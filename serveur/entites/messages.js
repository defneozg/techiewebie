const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/techie_webie_db";

// Database Name
const dbName = 'techie_webie_db';

// Collection Name
const collectionName = 'messages'; // Change collection name to 'messages'

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to insert a new message
async function insertMessage(message) {
  try {
    // Validate message data
    if (!message.discussionId || !message.text) {
      throw new Error('Discussion ID and message text are required.');
    }
    // Add createdAt field if not provided
    if (!message.createdAt) {
      message.createdAt = new Date();
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert message into the collection
    const result = await collection.insertOne(message);
    console.log(result);
    return result.insertedId;
  } catch (error) {
    // Handle errors
    console.error('Error inserting message:', error.message);
    throw error; // Rethrow the error for the caller to handle
  } finally {
    // Close the MongoDB client connection
    //await client.close();
  }
}

// Function to get all messages by discussionId
async function getAllMessagesByDiscussionId(discussionId) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query messages by discussionId from the collection
    const messages = await collection.find({ discussionId: new ObjectId(discussionId) }).toArray();
    console.log(messages);
    return messages;
  } catch (error) {
    // Handle errors
    console.error('Error fetching messages:', error.message);
    throw error; // Rethrow the error for the caller to handle
  } finally {
    // Close the MongoDB client connection
    await client.close();
  }
}

module.exports = { insertMessage, getAllMessagesByDiscussionId };
