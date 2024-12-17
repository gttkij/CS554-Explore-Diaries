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
  const fireId = currentUser.uid;
  const navigate = useNavigate();

  // Display user's posts here
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/api/posts", {
  //         params: {
  //           fireId: fireId,
  //         },
  //       });
  //       const data = await response.json();
  //       if (Array.isArray(data)) {
  //         setPosts(data);
  //       } else {
  //         console.error("Expected an array of posts");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     }
  //   };

  //   fetchPosts();
  // }, []);

  return (
    <div>
      <div>
        <SideBar />
      </div>
      <div>
        <AddPost />
      </div>

      <div className="post-list">
        {/* {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              title={post.title}
              description={post.description}
              location={post.location}
              category={post.categpry}
            />
          ))
        ) : (
          <p>User does not have any posts</p>
        )} */}
        <Post
          title="test"
          description="test"
          location="location"
          category="test"
        />
        <Post
          title="test"
          description="test"
          location="location"
          category="test"
        />
      </div>
    </div>
  );
}
