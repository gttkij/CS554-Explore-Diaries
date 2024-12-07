import React, { useState } from 'react';
import './HomePage.css';

const HomePage = () => {
  const posts = [
    {
      id: 1,
      title: "Amazing trip to the beach",
      description: "The perfect vacation at the sunny beach with family and friends.",
      image: "https://via.placeholder.com/150",
      location: "California",
      category: "Leisure"
    },
    {
      id: 2,
      title: "Hiking Adventure",
      description: "Exploring the great outdoors in the mountains with stunning views.",
      image: "https://via.placeholder.com/150",
      location: "Rocky Mountains",
      category: "Adventure"
    },
    {
      id: 3,
      title: "City Escape",
      description: "A weekend getaway to explore the bustling city streets.",
      image: "https://via.placeholder.com/150",
      location: "New York",
      category: "Cultural Experiences"
    },
    // Add more posts as needed
  ];

  const categories = ["All", "Adventure", "Cultural Experiences", "Leisure"];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="home-page">
      <h1>Explore Diaries</h1>
      
      {/* Search Bar with Button */}
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

      {/* Categories Display */}
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
      <div className="post-list">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image} alt={post.title} />
            <div className="post-info">
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <p><strong>Location:</strong> {post.location}</p>
              <p><strong>Category:</strong> {post.category}</p>
              <button>Read more</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
