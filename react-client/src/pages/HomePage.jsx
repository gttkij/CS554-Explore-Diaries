import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = [
    "All",
    "Adventure",
    "Cultural Experiences",
    "Leisure",
    "Nature",
    "Urban Exploration",
    "Wildlife",
    "Solo Travel",
    "Family Trips",
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:9200/posts/_search`, {
          method: "POST",  // Change to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              match_all: {},  // This fetches all posts
            },
          }),
        });
  
        const data = await response.json();
        const hits = data.hits.hits.map((hit) => hit._source); // Extract the posts
        setPosts(hits);
      } catch (error) {
        console.error("Error fetching posts from Elasticsearch:", error);
      }
    };
  
    fetchPosts();
  }, [selectedCategory]); // Use only selectedCategory here, since no search is being used

  // Filter posts based on search query and selected category
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === "All" || post.category.includes(selectedCategory);
    const matchesSearch =
      (post.title &&
        post.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.description &&
        post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.location &&
        post.location &&
        post.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.category &&
        post.category.toLowerCase().includes(searchQuery.toLowerCase()));

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
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
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
              <img 
                src={post.media && post.media[0] ? `http://localhost:3000${post.media[0]}` : ''} 
                alt={post.title} 
                style={{ display: post.media && post.media.length > 0 ? 'block' : 'none' }}
              />
              <div className="post-info">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p>
                  <strong>Location Name:</strong> {post.location}
                </p>
                <p>
                  <strong>Category:</strong> {post.category}
                </p>
                <button>Read more</button>
                {/* <CommentsList postId={post.id} userId={"currentUserId"} /> */}
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
