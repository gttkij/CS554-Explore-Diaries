import express from 'express';
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost
} from '../data/posts.js';

import multer from 'multer';
import { exec } from 'child_process';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const isVideo = file.mimetype.startsWith('video');
  const destination = `public/media/${file.filename}${isVideo ? '.mp4' : '.png'}`;

  if (!isVideo) {
    exec(`convert ${file.path} -resize 800x800 ${destination}`, (err) => {
      if (err) return res.status(500).json({ error: 'Image processing failed' });
      res.json({ url: `http://localhost:5173/media/${file.filename}.png` });
    });
  } else {
    
    exec(`mv ${file.path} ${destination}`, (err) => {
      if (err) return res.status(500).json({ error: 'Video upload failed' });
      res.json({ url: `http://localhost:5173/media/${file.filename}.mp4` });
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { userId, title, content, media, category, lat, lng, name} = req.body;

    if (!userId || !title || !content || !media || !category || !lat || !lng || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const createdAt = new Date()

    const post = await createPost(userId, title, content, media, category, lat, lng, name, createdAt);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await getAllPosts();
    
    res.status(200).json(posts);
  } catch (error) {

    if(error === 'No posts found') res.status(404).json({ error: error.toString() });

    res.status(400).json({ error: error.toString() });
  }
});

router.get('/:id', async (req, res) => {
  try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const post = await getPost(id);

    res.status(200).json(post);
  } catch (error) {

    if(error === 'Post not found') res.status(404).json({ error: error.toString() });

    res.status(400).json({ error: error.toString() });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content, media, category, lat, lng, name } = req.body;

    if (!title || !content || !media || !category || !lat || !lng || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedPost = await updatePost(req.params.id, title, content, media, category, lat, lng, name);
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.delete('/:id', async (req, res) => {
  try {

    if(!id) res.status(400).json({error : "Post ID is required"})

    const deletedPost = await deletePost(req.params.id);
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(404).json({ error: error.toString() });
  }
});

export default router;
