import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import Comments from "./Comments";
//Assuming you might want custom styles

function Comment({ comment }) {
  // const [comments, setComments] = useState([]);

  return (
    <div className="comments-container">
      <p>{comment.content}</p>
    </div>
  );
}

export default Comment;
