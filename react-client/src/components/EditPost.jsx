import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
// import "./Post.css";
// import CommentsList from "./components/CommentsList";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../pages/SignIn.css";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
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

export function EditPost(props) {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState("");
  const fireId = currentUser.uid;

  const id = props.postId;

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    uploadData.append("userId", fireId);
    uploadData.append("id", id);
    const formData = new FormData(event.currentTarget);

    const title = formData.get("title").trim();
    const content = formData.get("content").trim();
    const location = formData.get("location").trim();
    const category = formData.get("category");
    const files = event.currentTarget.photos.files; // Get file input

    if (title.length === 0 || content.length === 0 || location.length === 0) {
      setError(true);
      return;
    }

    const uploadData = new FormData();
    uploadData.append("userId", fireId);
    uploadData.append("userName", username);
    uploadData.append("title", title);
    uploadData.append("content", content);
    uploadData.append("category", category);
    uploadData.append("location", location);
    // if (formData.get("title")) {
    //   let title = formData.get("title").trim();

    //   if (title.length === 0) {
    //     setError(true);
    //     return;
    //   }
    //   uploadData.append("title", title);
    // }

    // if (formData.get("content")) {
    //   let content = formData.get("content").trim();

    //   if (content.length === 0) {
    //     setError(true);
    //     return;
    //   }
    //   uploadData.append("content", content);
    // }

    // if (formData.get("category")) {
    //   let category = formData.get("category");

    //   uploadData.append("category", category);
    // }

    // if (formData.get("location")) {
    //   let location = formData.get("location");
    //   location = location.trim();
    //   if (location.length === 0) {
    //     setError(true);
    //     return;
    //   }

    //   uploadData.append("location", location);
    // }

    for (let i = 0; i < files.length && i < 5; i++) {
      uploadData.append("media", files[i]);
    }
    const postUrl = "http://localhost:3000/api/posts";
    try {
      const editPost = await axios.put(postUrl, postInfo, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": "application/json",
        },
      });

      setError(false);
      alert("Post Updated!");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div>
      {/* <button onClick={handleClickOpen}>Edit</button> */}
      <IconButton onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleEdit,
        }}
      >
        <DialogTitle>Edit</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit your post here</DialogContentText>
          {error && <p className="error-message">Please enter valid input</p>}
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="outlined-multiline-static"
            rows={4}
            name="content"
            label="Content"
            multiline
            variant="standard"
            fullWidth
            required
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="location"
            name="location"
            label="Location"
            fullWidth
            variant="standard"
          />
          <FormControl variant="standard" sx={{ minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={category}
              name="category"
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            id="photos"
            name="photos"
            accept="image/*"
            multiple
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleClose}>Cancel</button>
          <button type="submit">Update</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
