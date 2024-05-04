const { MongoClient, ObjectId } = require("mongodb");

const uri = "mongodb://localhost:27017";

const dbName = "techie_webie_db";

const collectionName = "discussions";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// insérer nouvelle discussion
async function insertDiscussion(discussion) {
  try {
    if (!discussion.title || !discussion.content || !discussion.username) {
      throw new Error("Discussion title, content and username are required.");
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
  } finally {
    //await client.close();
  }
}

// GET toutes les discussions
async function getAllDiscussions() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const discussions = await collection.find().toArray();
    return discussions;
  } catch (error) {
    console.error("Error fetching discussions:", error.message);
    throw error;
  } finally {
    //await client.close();
  }
}

// GET discussion par discussionid
async function findDiscussionById(discussionId) {
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
    console.error("Error finding discussion by ID:", error.message);
    throw error;
  }
}

// GET discussion par username
async function findDiscussionByUsername(username) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    console.log("hey", username);
    const user = username;
    const discussion = await collection.find({ username: user }).toArray();
    console.log(discussion);
    return discussion;
  } catch (error) {
    console.error("Error finding discussion by username:", error.message);
    throw error;
  }
}

module.exports = {
  insertDiscussion,
  getAllDiscussions,
  findDiscussionById,
  findDiscussionByUsername,
};
