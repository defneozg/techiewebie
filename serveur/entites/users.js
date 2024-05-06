const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

class Users {
  async createUser(username, password, firstName, lastName, isAdmin = false) {
    try {
      const collection = db.collection("users");
      const user = {
        username,
        password,
        firstName,
        lastName,
        isAdmin,
      };
      const result = await collection.insertOne(user);
      return result.insertedId;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async get(userid) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userid) });
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  }

  async exists(username) {
    try {
      const collection = db.collection("users");
      const count = await collection.countDocuments({ username: username });
      return count > 0;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  }

  async checkpassword(username, password) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ username: username });
      console.log(user);
      if (!user) {
        return null;
      }

      const isPasswordValid = await comparePassword(password, user.password);
      console.log(isPasswordValid);

      return isPasswordValid ? user._id : null;
    } catch (error) {
      console.error("Error checking password:", error);
      throw error;
    }
  }

  async isAdmin(userId) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      return user.isAdmin === true;
    } catch (error) {
      console.error("Error checking admin status:", error);
      throw error;
    }
  }

  async findByUsername(username) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ username });
      return {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };
    } catch (error) {
      throw new Error("Error finding user by username: ${error.message}");
    }
  }
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return password === hashedPassword;
  //return await bcrypt.compare(password, hashedPassword);
}

exports.default = Users;
