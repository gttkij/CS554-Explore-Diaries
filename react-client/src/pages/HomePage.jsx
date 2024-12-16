import React, { useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ["All", "Adventure", "Cultural Experiences", "Leisure"];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        const data = await response.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Expected an array of posts');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category.includes(selectedCategory);
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.location.name.toLowerCase().includes(searchQuery.toLowerCase()) || // Now checking the 'name' property of location
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home-page">
      <h1>Explore Diaries</h1>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search blog posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button">
          <img src="./imgs/search.png" alt="Search" />
        </button>
      </div>

      {/* Category Filter */}
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Post List */}
      <div className="post-list1">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <img src={post.image} alt={post.title} />
              <div className="post-info">
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <p><strong>Location Name:</strong> {post.location.name}</p>
                <p><strong>Latitude:</strong> {post.location.lat}</p>
                <p><strong>Longitude:</strong> {post.location.lng}</p>
                <p><strong>Category:</strong> {post.category.join(', ')}</p>
                <button>Read more</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
