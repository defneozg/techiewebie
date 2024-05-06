class Messages {
  async insertMessage(message) {
    try {
      const collection = db.collection("messages");

      if (!message.discussionId || !message.msg || !message.username) {
        throw new Error(
          "Discussion ID, message text, and username are required."
        );
      }

      if (!message.createdAt) {
        message.createdAt = new Date();
      }

      const result = await collection.insertOne(message);
      return result.insertedId;
    } catch (error) {
      console.error("Error inserting message:", error.message);
      throw error;
    }
  }

  async getAllMessagesByDiscussionId(discussionId) {
    try {
      const collection = db.collection("messages");
      const messages = await collection
        .find({ discussionId: discussionId })
        .toArray();
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      throw error;
    }
  }

  async findMessageByUsername(username) {
    try {
      const collection = db.collection("messages");
      const user = username;
      const message = await collection.find({ username: user }).toArray();
      return message;
    } catch (error) {
      console.error("Error finding message by username:", error.message);
      throw error;
    }
  }
}

exports.default = Messages;
