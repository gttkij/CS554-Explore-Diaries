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

if (!Array.isArray(media)) throw 'media should be an array'

for (let i of media)
{
    if(typeof i !== 'string') throw 'media should only contain strings'
    if (!/^http:\/\/localhost:5173\/media\/[a-zA-Z0-9_-]+\.(jpeg|jpg|png|gif|webp|mp4)$/i.test(i)) throw 'Invalid image/video URL'

}

if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) throw 'Invalid latitude'
if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) throw 'Invalid longitude'

if (!(createdAt instanceof Date) || isNaN(createdAt.getTime())) throw 'Invalid createdAt'

const updatedAt = createdAt

if(!Array.isArray(category)) throw 'category has to be an array'

for (let j of category)
{
    if (typeof j !== 'string') throw 'category should only contain strings'
    if(!["Adventure", "Cultural Experiences", "Leisure"].includes(j)) throw 'Invalid category'
}

if (!ObjectId.isValid(userId)) throw 'Invalid userId';

const location = {lat, lng, name}
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

const post = await posts()

}
catch(e)
{
throw e
}

}

export const updatePost = async (id, title, content, media, category, lat, lng, name) => {

try
{

const post = await posts()

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

}
catch(e)
{
throw e
}

}