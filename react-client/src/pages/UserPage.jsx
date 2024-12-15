import SideBar from "../components/SideBar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Post } from "../components/Post";

import "./UserPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function UserPage() {
  const { currentUser } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const fireId = currentUser.fireId;
  const navigate = useNavigate();

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

      <div className="post-list">
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
