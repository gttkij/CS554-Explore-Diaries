import React, { useState, useEffect, useContext } from "react";
import Comment from "./Comments";
import CommentForm from "./CommentForm";
// import { AuthContext } from "./AuthContext";  // Assuming you have an AuthContext
import { AuthContext } from "../context/AuthContext";
export function CommentsList(props) {
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  // const userId = currentUser?.uid;
  const postId = props.postId;
  console.log(postId);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/comments/${postId}`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [postId]);

  const addComment = async (postId, text, authorName, userId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/comments/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            userName: authorName,
            content: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();
      setComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error("Error adding comment", error.message);
      alert("Failed to add comment. Please try again.");
    }
  };

  const editComment = async (id, content) => {
    try {
      await fetch(`http://localhost:3000/api/comments/comment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const updatedComments = comments.map((comment) => {
        if (comment._id === id) {
          return { ...comment, content };
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Error editing comment", error.message);
      alert("Failed to edit comment. Please try again.");
    }
  };

  const deleteComment = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/comments/comment/${id}`, {
        method: "DELETE",
      });
      setComments(comments.filter((comment) => comment._id !== id));
    } catch (error) {
      console.error("Error deleting comment", error.message);
      alert("Failed to delete comment. Please try again.");
    }
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          onEdit={editComment}
          onDelete={deleteComment}
        />
      ))}
      <CommentForm postId={postId} onSave={addComment} userId={userId} />
    </div>
  );
}
