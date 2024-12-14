import { dbConnection, closeConnection } from '../config/mongoConnections.js';
import { createPost } from '../data/posts.js';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';  // Import ObjectId

dotenv.config();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const generateSeedData = async () => {
  try {
    const db = await dbConnection();
    await db.dropDatabase();

    const postsData = [];
    const postsDataLen = 10;

    for (let i = 0; i < postsDataLen; i++) {
      const media = [
        `http://localhost:5173/media/sample_media_${i + 1}.jpg`,
        `http://localhost:5173/media/sample_media_${i + 2}.jpg`
      ];
      const category = ["Adventure", "Cultural Experiences", "Leisure"];
      const postData = {
        userId: new ObjectId(),
        title: `Sample Post Title ${i + 1}`,
        content: `Sample post content for post ${i + 1}`,
        media: media,
        category: [category[randomInt(0, category.length - 1)]],
        lat: randomInt(-90, 90),
        lng: randomInt(-180, 180),
        name: `Sample Location ${i + 1}`,
        createdAt: new Date()
      };
      postsData.push(postData);
    }

    for (const postData of postsData) {
      await createPost(
        postData.userId.toString(),
        postData.title,
        postData.content,
        postData.media,
        postData.category,
        postData.lat,
        postData.lng,
        postData.name,
        postData.createdAt
      );
      console.log(`Post titled "${postData.title}" created successfully`);
    }

    await closeConnection();
    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (error) {
    console.error('Error inserting seed data:', error);
  }
};

generateSeedData();
