import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import SignOut from "../components/SignOut"; // Import SignOut component
import "./HomePage.css";
// import { CommentsList } from "../components/CommentsList";
import { CommentsList } from "../components/CommentsList";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { currentUser } = useContext(AuthContext); // Get currentUser from AuthContext
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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:9200/posts/_search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: {
              match_all: {}, // Fetch all posts
            },
          }),
        });

        const data = await response.json();
        const hits = data.hits.hits.map((hit) => ({
          id: hit._id,
          ...hit._source,
        }));
        setPosts(hits);
      } catch (error) {
        console.error("Error fetching posts from Elasticsearch:", error);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

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

  const handleReadMore = (postId) => {
    console.log("Post ID in handleReadMore:", postId);
    navigate(`/post/${postId}`);
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleUsernameClick = () => {
    navigate(`/userpage`); // Navigate to the UserPage using the username
  };

  return (
    <div className="home-page">
      {/* Header section with Explore Diaries and Sign In/Sign Up buttons */}
      <div className="header-container">
        <h1>Explore Diaries</h1>

        {/* Conditionally render Sign In/Sign Up buttons or username */}
        {currentUser ? (
          <div className="auth-buttons">
            <button onClick={handleUsernameClick}>
              {currentUser.displayName || currentUser.email}{" "}
              {/* Display username */}
            </button>
            <SignOut /> {/* Use SignOut component for logging out */}
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignUp}>Sign Up</button>
          </div>
        )}
      </div>

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
                src={
                  post.media && post.media[0]
                    ? `http://localhost:3000${post.media[0]}`
                    : ""
                }
                alt={post.title}
                style={{
                  display:
                    post.media && post.media.length > 0 ? "block" : "none",
                }}
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
                <button onClick={() => handleReadMore(post.id)}>
                  Read more
                </button>
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
