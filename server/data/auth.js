import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

export const addUser = async (name, email) => {
  if (!name || !email) {
    throw "Must provide valid user name or email";
  }
  const usersCollection = await users();
  const userExsit = await usersCollection.findOne({ email: email });

  if (userExsit) {
    throw "User already exists.";
  }

  const newUser = {
    _id: new ObjectId(),
    name: name,
    email: email,
    posts: [],
  };

  const addNew = await usersCollection.insertOne(newUser);
  if (!addNew) {
    throw "Cannot Add New User";
  }

  return newUser;
};
