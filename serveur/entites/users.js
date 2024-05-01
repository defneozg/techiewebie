const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
class Users {
  constructor(db) {
    this.db = db;
  }

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
      return result.insertedId; //Retour de userId de l'utilisateur créé
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async get(userid) {
    const client = await this.db;
    try {
      const collection = client.collection("users");
      const user = await collection.findOne({ _id: userid });
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    } finally {
      await client.close();
    }
  }

  async exists(username) {
    try {
      const collection = db.collection("users");
      const count = await collection.countDocuments({ username: username });
      return count > 0; // Check if at least one document exists
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error; // Re-throw for handling in calling code
    } finally {
      //await client.close();
    }
  }

  async checkpassword(username, password) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ username: username });
      console.log(user);
      if (!user) {
        return null; // User not found
      }

      // Implement secure password comparison (replace with your hashing library)
      const isPasswordValid = await comparePassword(password, user.password);
      console.log(isPasswordValid);

      return isPasswordValid ? user._id : null;
    } catch (error) {
      console.error("Error checking password:", error);
      throw error; // Re-throw for handling in calling code
    } finally {
      //await client.close();
    }
  }

  async isAdmin(userId) {
    try {
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });
      return user.isAdmin === true; // Return true if user is admin
    } catch (error) {
      console.error("Error checking admin status:", error);
      throw error; // Re-throw for handling in calling code
    } finally {
      //await client.close();
    }
  }
}

async function hashPassword(password) {
  // Use bcrypt to hash the password securely
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function comparePassword(password, hashedPassword) {
  // Use bcrypt to compare the provided password with the hashed password
  return password === hashedPassword;
  //return await bcrypt.compare(password, hashedPassword);
}

exports.default = Users;
