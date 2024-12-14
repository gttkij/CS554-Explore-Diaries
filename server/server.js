import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import configRoutes from './routes/index.js';
import { dbConnection, closeConnection } from './config/mongoConnections.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})); //MIGHT CHANGE

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthenticationState',
  secret: 'ssshh secret',
  resave: false,
  saveUninitialized: false
}));

let db;

const connectToDb = async () => {
  try {
    db = await dbConnection();
  } catch (error) {
    console.error('Error establishing MongoDB connection:', error);
  }
};

connectToDb();

// API routes
app.get('/api/posts', async (req, res) => {
  try {
    const postsCollection = db.collection('posts');
    const posts = await postsCollection.find({}).toArray();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts from database' });
  }
});

configRoutes(app);

// IF FRONTEND ENDS UP RUNNING ON 3000, CHANGE THIS TO 3001:-
app.listen(3000, () => {
  console.log('Backend is running on http://localhost:3000');
});

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0); // Gracefully shut down the server
});
