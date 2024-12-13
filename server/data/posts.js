import posts from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import redis from 'redis'

const client = redis.createClient({url: 'redis://localhost:6379'})
client.connect().catch(err => console.error('Redis Client Error', err))

export const createPost = async (userId, title, content, media, category, lat, lng, name, createdAt) => {

try
{

const post = await posts()

if (!userId) throw 'userId not provided';
if (!title) throw 'title not provided';
if (!content) throw 'content not provided';
if (!media) throw 'media not provided';
if (!category) throw 'category not provided';
if (!lat) throw 'lat not provided';
if (!lng) throw 'lng not provided';
if (!name) throw 'name not provided';
if (!createdAt) throw 'createdAt not provided';

if(typeof userId !== 'string') throw 'userId should be a string'
if(typeof title !== 'string') throw 'Title should be a string'
if(typeof content !== 'string') throw 'Content should be a string'
if(typeof name !== 'string') throw 'Location Name should be a string'

userId = userId.trim()
title = title.trim()
content = content.trim()
name = name.trim()

if(userId.length === 0) throw 'userId should not be empty'
if(title.length === 0) throw 'title should not be empty'
if(content.length === 0) throw 'content should not be empty'
if(name.length === 0) throw 'name should not be empty'

if (!Array.isArray(media)) throw 'media should be an array'

for (let i of media)
{

if(typeof i !== 'string') throw 'media should only contain strings'
i = i.trim()
if(i.length === 0) throw 'media cannot contain empty strings'
if (!/^http:\/\/localhost:5173\/media\/[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif|webp|mp4)$/i.test(i)) throw 'Invalid image/video URL'

}

if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) throw 'Invalid latitude'
if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) throw 'Invalid longitude'

if(!Array.isArray(category)) throw 'category has to be an array'

for (let j of category)
{
    if (typeof j !== 'string') throw 'category should only contain strings'
    j = j.trim()
    if(j.length === 0) throw 'category cannot contain empty strings'
    if(!["Adventure", "Cultural Experiences", "Leisure"].includes(j)) throw 'Invalid category'
}

const location = {lat, lng, name}

if (!ObjectId.isValid(userId)) throw 'Invalid userId';

if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) throw 'Invalid createdAt'

createdAt = createdAt.toISOString()
const updatedAt = createdAt

const likes = 0
const commentsCount = 0

const newPost = {userId, title, content, media, category, location, likes, commentsCount, createdAt, updatedAt}

let insertPost = await post.insertOne(newPost);

if (!insertPost.acknowledged || !insertPost.insertedId) throw 'Post could not be entered into the database'

const cacheKey = 'post:'+insertPost.insertedId.toString();
await client.del('posts')
await client.set(cacheKey, JSON.stringify(newPost));

}
catch(e)
{
throw e
}

}

export const getAllPosts = async () => {

try
{

const cachedPosts = await client.get('posts')
if(cachedPosts) return JSON.parse(cachedPosts)

const post = await posts()

let postList = await post.find({}).toArray();
    
if (!postList) throw 'Could not get all posts';
if (postList.length === 0) throw 'No posts found'

for (let i = 0; i<postList.length; i++)
{
postList[i].id = postList[i]._id.toString()
}

await client.setEx('posts', 3600, JSON.stringify(postList));

return postList

}
catch(e)
{
throw e
}
    
}

export const getPost = async (id) => {

try
{

if(!id) throw 'No Post ID given'
if(typeof id !== 'string') throw 'Post ID provided should be a string'
id = id.trim()
if(id.length === 0) throw 'Post ID cannot be empty'
if (!ObjectId.isValid(id)) throw 'Invalid Post ID';

const cacheKey = 'post:'+id
const cachedPost = await client.get(cacheKey)
if(cachedPost) return JSON.parse(cachedPost)

let idno = ObjectId.createFromHexString(id)

const post = await posts()

const retrievedPost = await post.findOne({_id: idno});
if (!retrievedPost) {
throw 'Post could not be found'
}

await client.set(cacheKey, JSON.stringify(retrievedPost))

return retrievedPost

}
catch(e)
{
throw e
}

}

export const updatePost = async (id, title, content, media, category, lat, lng, name) => {

try
{

if(!id) throw 'No Post ID given'
if(typeof id !== 'string') throw 'Post ID provided should be a string'
id = id.trim()
if(id.length === 0) throw 'Post ID cannot be empty'
if (!ObjectId.isValid(id)) throw 'Invalid Post ID';
let idno = ObjectId.createFromHexString(id)

if (!title) throw 'title not provided';
if (!content) throw 'content not provided';
if (!media) throw 'media not provided';
if (!category) throw 'category not provided';
if (!lat) throw 'lat not provided';
if (!lng) throw 'lng not provided';
if (!name) throw 'name not provided';

if(typeof title !== 'string') throw 'Title should be a string'
if(typeof content !== 'string') throw 'Content should be a string'
if(typeof name !== 'string') throw 'Location Name should be a string'

title = title.trim()
content = content.trim()
name = name.trim()

if(title.length === 0) throw 'title should not be empty'
if(content.length === 0) throw 'content should not be empty'
if(name.length === 0) throw 'name should not be empty'

if (!Array.isArray(media)) throw 'media should be an array'

for (let i of media)
{

if(typeof i !== 'string') throw 'media should only contain strings'
i = i.trim()
if(i.length === 0) throw 'media cannot contain empty strings'
if (!/^http:\/\/localhost:5173\/media\/[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif|webp|mp4)$/i.test(i)) throw 'Invalid image/video URL'

}

if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) throw 'Invalid latitude'
if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) throw 'Invalid longitude'

if(!Array.isArray(category)) throw 'category has to be an array'

for (let j of category)
{
    if (typeof j !== 'string') throw 'category should only contain strings'
    j = j.trim()
    if(j.length === 0) throw 'category cannot contain empty strings'
    if(!["Adventure", "Cultural Experiences", "Leisure"].includes(j)) throw 'Invalid category'
}

const location = {lat, lng, name}

const updatedAt = new Date().toISOString();

let updatePost = {title, content, media, category, location, updatedAt}

const post = await posts()

const updatedPost = post.findOneAndUpdate({_id: idno},
    {$set: updatePost},
    {returnDocument: 'after'})

if(!updatedPost) throw 'Could not update post'

const cacheKey = 'post:'+id
await client.flushDb()
await client.set(cacheKey, JSON.stringify(updatedPost));

return updatedPost

}
catch(e)
{
throw e
}

}

export const deletePost = async (id) => {

try
{

const post = await posts()
if(!id) throw 'No Post ID given'
if(typeof id !== 'string') throw 'Post ID provided should be a string'
id = id.trim()
if(id.length === 0) throw 'Post ID cannot be empty'
if (!ObjectId.isValid(id)) throw 'Invalid Post ID';

let idno = ObjectId.createFromHexString(id)

const deletedPost = await post.findOneAndDelete({_id: idno});
if (!deletedPost) {
throw 'Post could not be deleted'
}

await client.flushDb()

return deletedPost

}
catch(e)
{
throw e
}

}