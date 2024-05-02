const { MongoClient, ObjectId } = require('mongodb');

// Connection URI
const uri = "mongodb://localhost:27017";

// Database Name
const dbName = 'techie_webie_db';

// Collection Name
const collectionName = 'discussionsAdmin';

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Function to insert a new discussion
async function insertAdminDiscussion(discussion) {
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
    //await client.close();
  }
}

// Function to get all discussions
async function getAllAdminDiscussions() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query all discussions from the collection
    const discussions = await collection.find().toArray();
    return discussions;
  } catch (error) {
    // Handle errors
    console.error('Error fetching discussions:', error.message);
    throw error; // Rethrow the error for the caller to handle
  } finally {
    // Close the MongoDB client connection
    //await client.close();
  }
}

// Function to find a discussion by ID
async function findAdminDiscussionById(discussionId) {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query the discussion by its ID
    console.log(discussionId);
    const id = new ObjectId(discussionId);
    const discussion = await collection.findOne({ _id: id });
    console.log(discussion);
    return discussion;
  } catch (error) {
    // Handle errors
    console.error('Error finding discussion by ID:', error.message);
    throw error; // Rethrow the error for the caller to handle
  } finally {
    // Close the MongoDB client connection
    //await client.close();
  }
}


module.exports = { insertAdminDiscussion, getAllAdminDiscussions, findAdminDiscussionById };
