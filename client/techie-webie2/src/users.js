import axios from "axios";

const baseUrl = "/api/users";

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    // Handle the error appropriately (e.g., throw an error, return a default value)
  }
};

const addUser = async (user) => {
  try {
    const response = await axios.post(baseUrl, user);
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    // Handle the error appropriately (e.g., throw an error)
  }
};

export default { getAll, addUser };
