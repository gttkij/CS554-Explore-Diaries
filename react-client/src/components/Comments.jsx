// rendering individual comments
import React, { useState } from 'react';

function Comments({ comment, onSave, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedText(comment.text);
  };

  const handleSave = () => {
    onEdit(comment._id, editedText);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(comment._id);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div>
          <p><strong>{comment.username}:</strong> {comment.content}</p>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default Comments;
