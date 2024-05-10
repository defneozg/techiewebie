const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

class Users {
  async createUser(
    username,
    password,
    firstName,
    lastName,
    isAdmin = false,
    isApproved = false
  ) {
    try {
      const hashedPassword = await hashPassword(password);
      const collection = db.collection("users");
      const user = {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        isAdmin,
        isApproved,
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

  async isUserNameAdmin(userName) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ username: userName });
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
        isAdmin: user.isAdmin,
      };
    } catch (error) {
      throw new Error("Error finding user by username: ${error.message}");
    }
  }

  async approveUser(username) {
    try {
      const collection = db.collection("users");
      await collection.updateOne({ username }, { $set: { isApproved: true } });
    } catch (error) {
      console.error("Error approving user:", error);
      throw error;
    }
  }

  async getPendingApprovals() {
    try {
      const collection = db.collection("users");
      const pendingUsers = await collection
        .find({ isApproved: false })
        .toArray();
      return pendingUsers;
    } catch (error) {
      console.error("Error getting pending approvals:", error);
      throw error;
    }
  }

  async checkIfUserIsApproved(username) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ username });

      // Check if the user exists and if their account is approved
      if (user && user.isApproved) {
        return true; // User is approved
      } else {
        return false; // User is not approved
      }
    } catch (error) {
      console.error("Error checking user approval status:", error);
      throw error;
    }
  }

  async makeAdmin(username) {
    try {
      const collection = db.collection("users");
      await collection.updateOne({ username }, { $set: { isAdmin: true } });
    } catch (error) {
      console.error("Error approving user:", error);
      throw error;
    }
  }
  async removeAdmin(username) {
    try {
      const collection = db.collection("users");
      await collection.updateOne({ username }, { $set: { isAdmin: false } });
    } catch (error) {
      console.error("Error approving user:", error);
      throw error;
    }
  }
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

exports.default = Users;
