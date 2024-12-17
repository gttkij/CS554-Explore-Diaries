import { posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import redis from "redis";
import validation from "../validation.js";

const client = redis.createClient({ url: "redis://localhost:6379" });
client.connect().catch((err) => console.error("Redis Client Error", err));

export const createPost = async (
  userId,
  userName,
  title,
  content,
  media,
  category,
  location
) => {
  try {
    const postCollection = await posts();
    const userCollection = await users();

    userId = validation.checkId(userId);
    userName = validation.checkString(userName, "User Name");
    title = validation.checkString(title, "Title", { min: 2, max: 100 });
    content = validation.checkString(content, "Content", { min: 10, max: 1000 });
    location = validation.checkString(location, "Location", { min: 2, max: 100 });
    media = validation.checkArray(media, "Media");
    category = validation.checkString(category, "Category");

    media = validation.checkMediaPath(media);

    const likes = 0;
    const commentList = [];
    
    const postDate = new Date().toISOString();

    const newPost = {
      userId,
      userName,
      title,
      content,
      media,
      category,
      location,
      postDate,
      likes,
      commentList,
    };

    let insertPost = await postCollection.insertOne(newPost);

    if (!insertPost.acknowledged || !insertPost.insertedId)
      throw "Post could not be entered into the database";

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { posts: insertPost.insertedId } }
    );

    const cacheKey = "post:" + insertPost.insertedId.toString();
    await client.del("posts");
    await client.set(cacheKey, JSON.stringify(newPost));

    return {
      ...newPost,
      _id: insertPost.insertedId
    };
  } catch (e) {
    throw e;
  }
};


export const getAllPosts = async () => {
  try {
    const cachedPosts = await client.get("posts");
    if (cachedPosts) return JSON.parse(cachedPosts);

    const postCollection = await posts();

    let postList = await postCollection.find({}).toArray();

    if (!postList) throw "Could not get all posts";
    if (postList.length === 0) throw "No posts found";

    postList.forEach(post => {
      post.id = post._id.toString();
    });

    await client.setEx("posts", 3600, JSON.stringify(postList));

    return postList;
  } catch (e) {
    throw e;
  }
};

export const getPost = async (id) => {
  try {
    if (!id) throw "No Post ID given";
    id = validation.checkId(id);

    const cacheKey = "post:" + id;
    const cachedPost = await client.get(cacheKey);
    if (cachedPost) return JSON.parse(cachedPost);

    const postCollection = await posts();

    let idno = ObjectId.createFromHexString(id);
    const retrievedPost = await postCollection.findOne({ _id: idno });
    if (!retrievedPost) throw "Post could not be found";

    await client.set(cacheKey, JSON.stringify(retrievedPost));

    return retrievedPost;
  } catch (e) {
    throw e;
  }
};

export const updatePost = async (
  id,
  userId,
  userName,
  title,
  content,
  media,
  category,
  location,
  postDate
) => {
  try {
    const postCollection = await posts();
    const userCollection = await users();

    id = validation.checkId(id);
    userId = validation.checkId(userId);
    userName = validation.checkString(userName, "User Name");
    title = validation.checkString(title, "Title", { min: 2, max: 100 });
    content = validation.checkString(content, "Content", { min: 10, max: 1000 });
    location = validation.checkString(location, "Location", { min: 2, max: 100 });
    media = validation.checkArray(media, "Media");
    category = validation.checkString(category, "Category");
    postDate = validation.checkString(postDate, "Post Date");

    media = validation.checkMediaPath(media);

    const updatedAt = new Date().toISOString();

    const updateFields = {
      userName,
      title,
      content,
      media,
      category,
      location,
      updatedAt,
      postDate,
    };

    let updatePost = await postCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!updatePost.value) throw "Post not found or update failed";

    const cacheKey = "post:" + id;
    await client.del(cacheKey);
    await client.set(cacheKey, JSON.stringify(updatePost.value));

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { "posts.$[elem]": updatePost.value } },
      { arrayFilters: [{ "elem._id": new ObjectId(id) }] }
    );

    return {
      postUpdated: true,
      postId: updatePost.value._id.toString(),
    };
  } catch (e) {
    throw e;
  }
};


export const deletePost = async (id, userId) => {
  try {
    const postCollection = await posts();
    const userCollection = await users();

    id = validation.checkId(id);
    userId = validation.checkId(userId);

    const deletePost = await postCollection.findOneAndDelete({ _id: new ObjectId(id) });
    if (!deletePost.value) throw "Post could not be deleted";

    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { posts: new ObjectId(id) } }
    );

    const cacheKey = "post:" + id;
    await client.del(cacheKey);

    return {
      postDeleted: true,
      postId: id,
    };
  } catch (e) {
    throw e;
  }
};
