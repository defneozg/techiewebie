const { MongoClient, ObjectID } = require('mongodb');

// Connection URI
const uri = "mongodb+srv://defneozg:BbTfpypQLwTaAAgS@cluster0.uxgeglj.mongodb.net/"; // Assuming MongoDB is running locally

// Database Name
const dbName = 'techie_webie_db';

// Collection Name
const collectionName = 'discussions';

// Create a MongoDB client
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the schema
const DiscussionSchema = {
  title: {
    type: 'string',
    required: true
  },
  body: {
    type: 'string',
    required: true
  },
  createdAt: {
    type: 'date',
    default: Date.now
  }
};

// Function to insert a new post
async function insertDiscussion(discussion) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(discussion);
    return result.ops[0];
  } finally {
    await client.close();
  }
}

module.exports = { insertDiscussion };
