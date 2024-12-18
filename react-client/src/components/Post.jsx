import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import "./Post.css";
// import CommentsList from "./components/CommentsList";
import axios from "axios";
import "../pages/SignIn.css";
import { MdOutlineUploadFile } from "react-icons/md";
import { styled } from "@mui/material/styles";
import { EditPost } from "./EditPost";
import { CommentsList } from "./CommentsList";

export function Post({ post }) {
  const { currentUser } = useContext(AuthContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Store index of current image

  const fireId = currentUser.uid;
  const id = post._id;
  console.log(id);

  const handleDelete = async () => {
    // '/:postId/delete')
    const url = `http://localhost:3000/api/posts/${id}/delete`;

    try {
      const deletePost = await axios.delete(url, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": "application/json",
        },
      });

      alert("Post Deleted!");
    } catch (e) {
      alert(e);
    }
  };

  const goToNextImage = () => {
    if (post.media && post.media.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.media.length); // Loop back to first image
    }
  };

  const goToPreviousImage = () => {
    if (post.media && post.media.length > 0) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + post.media.length) % post.media.length
      ); // Loop back to last image
    }
  };
  return (
    <div className="post-card">
      <div className="post-info">
        <div className="image-slider">
          {post.media && post.media.length > 0 ? (
            <>
              {post.media[currentImageIndex].endsWith(".mp4") ? (
                // Video content
                <video
                  width="100%"
                  controls
                  key={currentImageIndex}
                  className="slider-image"
                >
                  <source
                    src={`http://localhost:3000${post.media[currentImageIndex]}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              ) : (
                // Image content
                <img
                  src={`http://localhost:3000${post.media[currentImageIndex]}`}
                  alt={post.title}
                  className="slider-image"
                />
              )}

              {/* Navigation buttons */}
              <button className="prev-btn" onClick={goToPreviousImage}>
                &lt;
              </button>
              <button className="next-btn" onClick={goToNextImage}>
                &gt;
              </button>
            </>
          ) : (
            <p>No media available for this post.</p>
          )}
        </div>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <p>
          <strong>Location:</strong> {post.location}
        </p>
        <p>
          <strong>Category:</strong> {post.category}
        </p>
        <EditPost postId={id} />

        <button onClick={handleDelete}>Delete</button>
        <CommentsList postId={id} userId={fireId} />
      </div>
    </div>
  );
}
