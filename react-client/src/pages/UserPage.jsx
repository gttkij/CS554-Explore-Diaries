import SideBar from "../components/SideBar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Post } from "../components/Post";

import "./UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddPost } from "../components/AddPost";

export function UserPage() {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  console.log(posts);

  // Display user's posts here
  useEffect(() => {
    if (currentUser) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/auth/userId`,
            {
              params: {
                fireId: fireId,
              },
            }
          );
          const data = response.data;

          if (Array.isArray(data)) {
            setPosts(data);
          } else {
            console.error("Expected an array of posts");
          }
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      fetchPosts();
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="login-container">
        <h2>You are not logged in</h2>
        <a href="/login">Log in</a>
        <a href="signup">Sign up</a>
      </div>
    );
  }
  const fireId = currentUser.uid;
  return (
    <div>
      <div>
        <SideBar />
      </div>
      <div>
        <AddPost />
      </div>

      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              title={post.title}
              content={post.content}
              location={post.location}
              category={post.category}
              id={post._id}
              key={post._id}
            />
          ))
        ) : (
          <p>User does not have any posts</p>
        )}
      </div>
    </div>
  );
}
