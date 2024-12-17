import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../utils/api';

const blogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
      } catch (err) {
        console.error('Failed to fetch post', err);
        setError('Post not found.');
      }
    };
    fetchPost();
  }, [id]);

  if (error) return <div><h1>{error}</h1></div>;
  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h3>Category: {post.category.join(', ')}</h3>
      <h4>Location: {post.location.name} ({post.location.lat}, {post.location.lng})</h4>
      <div>
        {post.media.map((url, index) => (
          <div key={index}>
            {url.endsWith('.mp4') ? (
              <video src={url} controls width="400" />
            ) : (
              <img src={url} alt="Post Media" width="400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default blogPost;
