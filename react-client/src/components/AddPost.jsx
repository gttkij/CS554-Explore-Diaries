import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IoMdAdd } from "react-icons/io";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useContext } from "react";
import "../pages/SignIn.css";
import { MdOutlineUploadFile } from "react-icons/md";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./Post.css";

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

export function AddPost() {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [error, setError] = useState(false);
  //   const [files, setFiles] = useState({});
  const fireId = currentUser.uid;
  const username = currentUser.displayName;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategory(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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

    for (let i = 0; i < files.length && i < 5; i++) {
      uploadData.append("media", files[i]);
    }
    console.log(uploadData);

    try {
      const postUrl = "http://localhost:3000/api/posts/addPost";

      const response = await axios.post(postUrl, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setError(false);
      alert("Post Added!");
    } catch (e) {
      alert(e);
    }
  };

  return (
    <div>
      <button variant="outlined" onClick={handleClickOpen}>
        <IoMdAdd /> <span>Add Post</span>
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create your new post here!
            {error && <p className="error-message">Please enter valid input</p>}
          </DialogContentText>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
