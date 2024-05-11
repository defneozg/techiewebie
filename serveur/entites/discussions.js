const { ObjectId } = require("mongodb");

class Discussions {
  async insertDiscussion(discussion) {
    try {
      if (!discussion.title || !discussion.content || !discussion.username) {
        throw new Error("Discussion title, content and username are required.");
      }
      if (!discussion.createdAt) {
        discussion.createdAt = new Date();
      }
      const collection = db.collection("discussions");
      const result = await collection.insertOne(discussion);
      return result.insertedId;
    } catch (error) {
      console.error("Error inserting discussion:", error.message);
      throw error;
    }
  }

  async insertAdminDiscussion(discussion) {
    try {
      if (!discussion.title || !discussion.content) {
        throw new Error("Discussion title, content and username are required.");
      }
      if (!discussion.createdAt) {
        discussion.createdAt = new Date();
      }
      const collection = db.collection("discussionsAdmin");
      const result = await collection.insertOne(discussion);
      return result.insertedId;
    } catch (error) {
      console.error("Error inserting discussion:", error.message);
      throw error;
    }
  }

  async getAllDiscussions() {
    try {
      const collection = db.collection("discussions");
      const discussions = await collection.find().toArray();
      return discussions;
    } catch (error) {
      console.error("Error fetching discussions:", error.message);
      throw error;
    }
  }

  async getAllAdminDiscussions() {
    try {
      const collection = db.collection("discussionsAdmin");
      const discussions = await collection.find().toArray();
      return discussions;
    } catch (error) {
      console.error("Error fetching discussions:", error.message);
      throw error;
    }
  }

  async findDiscussionById(discussionId) {
    try {
      console.log("sup");
      const collection = db.collection("discussions");
      const id = new ObjectId(discussionId);
      const discussion = await collection.findOne({ _id: id });
      return discussion;
    } catch (error) {
      console.error("Error finding discussion by ID:", error.message);
      throw error;
    }
  }

  async findAdminDiscussionById(discussionId) {
    try {
      const collection = db.collection("discussionsAdmin");
      const id = new ObjectId(discussionId);
      const discussion = await collection.findOne({ _id: id });
      return discussion;
    } catch (error) {
      console.error("Error finding discussion by ID:", error.message);
      throw error;
    }
  }

  async findDiscussionByUsername(username) {
    try {
      const collection = db.collection("discussions");
      const user = username;
      const discussion = await collection.find({ username: user }).toArray();
      return discussion;
    } catch (error) {
      console.error("Error finding discussion by username:", error.message);
      throw error;
    }
  }

  async searchDiscussions(search) {
    try {
      const discussions = await db
        .collection("discussions")
        .find({
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        })
        .toArray();
      return discussions;
    } catch (error) {
      throw new Error("Error searching discussions");
    }
  }

  async deleteDiscussionById(discussionId) {
    try {
      const collection = db.collection("discussions");
      const id = new ObjectId(discussionId);
      const result = await collection.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error("Discussion not found");
      }
      return true;
    } catch (error) {
      console.error("Error deleting discussion:", error.message);
      throw error;
    }
  }

  async deleteAdminDiscussionById(discussionId) {
    try {
      const collection = db.collection("discussionsAdmin");
      const id = new ObjectId(discussionId);
      const result = await collection.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        throw new Error("Discussion not found");
      }
      return true;
    } catch (error) {
      console.error("Error deleting discussion:", error.message);
      throw error;
    }
  }
}

exports.default = Discussions;
