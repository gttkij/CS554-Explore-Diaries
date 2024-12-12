import posts from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

export const createPost = async (userId, title, content, media, category, lat, lng, name) => {

try
{

const post = await posts()

if (!ObjectId.isValid()) throw 'Invalid ID';

}
catch(e)
{
throw new Error(e)
}

}

export const getAllPosts = async (id) => {

try
{

const post = await posts()

}
catch(e)
{
throw new Error(e)
}
    
}

export const getPost = async (id) => {

try
{

const post = await posts()

}
catch(e)
{
throw new Error(e)
}

}

export const updatePost = async (id, title, content, media, category, lat, lng, name) => {

try
{

const post = await posts()

}
catch(e)
{
throw new Error(e)
}

}

export const deletePost = async (id) => {

try
{

const post = await posts()

}
catch(e)
{
throw new Error(e)
}

}