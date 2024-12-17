import { Router } from 'express';
import { createPost, getAllPosts, getPost, updatePost, deletePost } from '../data/posts.js';
import multer from 'multer';
import * as path from "path";
import fs from 'fs';
import redis from 'redis';

const client = redis.createClient({ url: "redis://localhost:6379" });
client.connect().catch((err) => console.error("Redis Client Error", err));

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadDir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const newFilename = uniqueSuffix + extension;
    callback(null, newFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: function (req, file, cb) {
    const lowercasedMimetype = file.mimetype.toLowerCase();
    if (!['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'].includes(lowercasedMimetype)) {
      return cb(new Error('Invalid file type. Please upload a JPG, JPEG, PNG, or MP4'), false);
    }
    cb(null, true);
  }
});

const router = Router();

router.route('/')
  .get(async (req, res) => {
    try {
      const cachedPosts = await client.get("posts");
      if (cachedPosts) {
        return res.status(200).json(JSON.parse(cachedPosts));
      }

      const posts = await getAllPosts();
      await client.setEx("posts", 3600, JSON.stringify(posts));
      res.status(200).json(posts);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router.route('/addPost')
  .post(upload.array('media', 5), async (req, res) => {
    const { userId, userName, title, content, category, location } = req.body;
    const media = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
      const { postCreated, postId } = await createPost(
        userId,
        userName,
        title,
        content,
        media,
        category,
        location
      );
      if (postCreated) {
        await client.del("posts");
        res.status(201).json({ message: 'Post created successfully', postId });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });

router.route('/:postId')
  .get(async (req, res) => {
    const { postId } = req.params;

    try {
      const cacheKey = `post:${postId}`;
      const cachedPost = await client.get(cacheKey);
      if (cachedPost) {
        return res.status(200).json(JSON.parse(cachedPost));
      }

      const post = await getPost(postId);
      await client.set(cacheKey, JSON.stringify(post));
      res.status(200).json(post);
    } catch (e) {
      res.status(404).json({ error: 'Post not found' });
    }
  });

router.route('/:postId/update')
  .put(upload.array('media', 5), async (req, res) => {
    const { postId } = req.params;
    const { title, content, category, location } = req.body;
    const media = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    try {
      const post = await getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const updatedPost = await updatePost(
        postId,
        post.userId,
        post.userName,
        title || post.title,
        content || post.content,
        media.length > 0 ? media : post.media,
        category || post.category,
        location || post.location,
        post.postDate 
      );

      const cacheKey = `post:${postId}`;
      await client.del(cacheKey);
      await client.set(cacheKey, JSON.stringify(updatedPost));

      res.status(200).json({ postUpdated: true, postId: updatedPost._id.toString() });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

router.route('/:postId/delete')
  .delete(async (req, res) => {
    const { postId } = req.params;

    try {
      const post = await getPost(postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const { postDeleted, postId: deletedPostId } = await deletePost(postId, post.userId);

      if (postDeleted) {
        const cacheKey = `post:${postId}`;
        await client.del(cacheKey);
        res.status(200).json({ message: 'Post deleted successfully', postId: deletedPostId });
      } else {
        res.status(400).json({ error: 'Post deletion failed' });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

export default router;
