import axios from 'axios';

export const getPost = async (id) => {
  return axios.get('http://localhost:3000/api/posts/' + id);
};

export const createPost = async (data) => {
  return axios.post('http://localhost:3000/api/posts', data);
};

export const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('http://localhost:3000/api/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updatePost = async (id, data) => {
  return axios.put('http://localhost:3000/api/posts/' + id, data);
};

export const deletePost = async (id) => {
  return axios.delete('http://localhost:3000/api/posts/' + id);
};
