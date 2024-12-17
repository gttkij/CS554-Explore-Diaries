// import * as React from "react";
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
  const [files, setFiles] = useState({});
  const fireId = currentUser.uid;

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
    const formJson = Object.fromEntries(formData.entries());

    let title = formJson.title;
    let content = formJson.content;
    let location = formJson.location;
    let category = formJson.category;

    console.log(files);
    let media = Array.from(files);

    let urls = media.map((file) => URL.createObjectURL(file));
    // console.log(urls);

    title = title.trim();
    content = content.trim();
    location = location.trim();
    if (title.length === 0 || content.length === 0 || location.length === 0) {
      setError(true);
      return;
    }

    // console.log(title, content, location, category, files);
    const postUrl = "http://localhost:3000/api/posts/addPost";
    try {
      const addPost = await axios.post(
        postUrl,
        {
          userId: fireId,
          title: title,
          content: content,
          location: location,
          category: category,
          media: urls,
        },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
          },
        }
      );

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
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<MdOutlineUploadFile />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              name="file"
              onChange={(event) => setFiles(event.target.files)}
              multiple
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
