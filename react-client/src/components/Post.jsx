import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import "./Post.css";
// import CommentsList from "./components/CommentsList";

import "../pages/SignIn.css";
import { MdOutlineUploadFile } from "react-icons/md";
import { styled } from "@mui/material/styles";
import { EditPost } from "./EditPost";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const categories = [
  "Adventure",
  "Cultural Experiences",
  "Leisure",
  "Nature",
  "Urban Exploration",
  "Wildlife",
  "Solo Travel",
  "Family Trips",
];

export function Post(props) {
  const { currentUser } = useContext(AuthContext);
  const fireId = currentUser.uid;
  const id = props.postId;

  const handleDelete = async () => {
    // '/:postId/delete')
    const url = `http://localhost:3000/api/posts/${id}/delete`;
    try {
      const deletePost = await axios.delete(
        url,
        { id: id, userId: fireId },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
          },
        }
      );

      alert("Post Deleted!");
    } catch (e) {
      alert(e);
    }
  };
  return (
    <div className="post-card">
      {/* <img src={props.image} alt={props.title} /> */}
      <div className="post-info">
        <h2>{props.title}</h2>
        <p>{props.content}</p>
        <p>
          <strong>Location:</strong> {props.location}
        </p>
        <p>
          <strong>Category:</strong> {props.category}
        </p>
        <EditPost postId={id} />

        <button onClick={handleDelete}>Delete</button>
        {/* <CommentsList postId={props.postId} userId={"currentUserId"} /> */}
      </div>
    </div>
  );
}
