const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";

const dbName = "techie_webie_db";

const collectionName = "discussionsAdmin";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// insérer discussion
async function insertAdminDiscussion(discussion) {
  try {
    if (!discussion.title || !discussion.content) {
      throw new Error("Discussion title and body are required.");
    }
    if (!discussion.createdAt) {
      discussion.createdAt = new Date();
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const result = await collection.insertOne(discussion);
    console.log(result);
    return result.insertedId;
  } catch (error) {
    console.error("Error inserting discussion:", error.message);
    throw error;
  }
}

// GET toutes les discussions
async function getAllAdminDiscussions() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const discussions = await collection.find().toArray();
    return discussions;
  } catch (error) {
    console.error("Error fetching discussions:", error.message);
    throw error;
  }
}

// GET discussion selon discussionid
async function findAdminDiscussionById(discussionId) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log(discussionId);
    const id = new ObjectId(discussionId);
    const discussion = await collection.findOne({ _id: id });
    console.log(discussion);
    return discussion;
  } catch (error) {
    console.error("Error finding discussion by ID:", error.message);
    throw error;
  }
}

module.exports = {
  insertAdminDiscussion,
  getAllAdminDiscussions,
  findAdminDiscussionById,
};
