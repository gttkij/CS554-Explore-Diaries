import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
//Assuming you might want custom styles

function Comment({ postId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Placeholder URL - Replace with your actual endpoint to fetch comments
        const response = await fetch(`http://localhost:3000/api/comments/${postId}`);
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="comments-container">
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <List>
        {comments.map((comment) => (
          <React.Fragment key={comment._id}>
            <ListItem alignItems="flex-start">
              <ListItemText
                primary={comment.username}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {new Date(comment.postDate).toLocaleDateString()} - {new Date(comment.postDate).toLocaleTimeString()}
                    </Typography>
                    {' - '}{comment.content}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default Comment;
