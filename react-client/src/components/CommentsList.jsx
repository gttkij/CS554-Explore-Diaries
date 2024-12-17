//manage a list of comments

import React, { useState, useEffect } from "react";
import Comment from "./Comments";
import CommentForm from "./CommentForm";

function CommentsList({ postId }) {
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser.uid;

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
    const response = await fetch(`http://localhost:3000/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, text, authorName, userId }),
    });
    const newComment = await response.json();
    setComments([...comments, newComment]);
  };

  const editComment = async (id, text) => {
    await fetch(`http://localhost:3000/api/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const updatedComments = comments.map((comment) => {
      if (comment._id === id) {
        return { ...comment, text };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const deleteComment = async (id) => {
    await fetch(`http://localhost:3000/api/comments/${id}`, {
      method: "DELETE",
    });
    setComments(comments.filter((comment) => comment._id !== id));
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

export default CommentsList;
