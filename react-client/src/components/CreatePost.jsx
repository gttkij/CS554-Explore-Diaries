import React, { useState } from 'react';
import { createPost, uploadMedia } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media: [],
    category: '',
    location: '',
    lat: '',
    lng: '',
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const response = await uploadMedia(file);
      setFormData({ ...formData, media: [...formData.media, response.data.url] });
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ ...formData, media: formData.media });
      navigate('/');
    } catch (err) {
      console.error('Failed to create post', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" onChange={handleChange} />
      <textarea name="content" placeholder="Content" onChange={handleChange} />
      <input type="file" onChange={handleFileChange} />
      <button type="button" onClick={handleUpload}>Upload Media</button>
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="lat" placeholder="Latitude" onChange={handleChange} />
      <input name="lng" placeholder="Longitude" onChange={handleChange} />
      <input name="location" placeholder="Location Name" onChange={handleChange} />
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
