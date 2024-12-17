import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
// import "./Post.css";
// import CommentsList from "./components/CommentsList";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../pages/SignIn.css";
import { MdOutlineUploadFile } from "react-icons/md";
import { styled } from "@mui/material/styles";

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
  //   const postId = props.postId;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const id = props.postId;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = async () => {
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    let postInfo = { id: id };

    if (formJson.title) {
      let title = formJson.title;
      title = title.trim();
      if (title.length === 0) {
        setError(true);
        return;
      }
      postInfo.title = title;
    }

    if (formJson.content) {
      let content = formJson.content;
      content = content.trim();
      if (content.length === 0) {
        setError(true);
        return;
      }
      postInfo.content = content;
    }

    if (formJson.category) {
      postInfo.category = formJson.category;
    }

    console.log(title, content, location, category, files);
    const postUrl = "http://localhost:3000/api/posts";
    try {
      const editPost = await axios.patch(postUrl, postInfo, {
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
  // className="post-card"
  const handleDelete = () => {};
  return (
    <div className="post-card">
      {/* <img src={props.image} alt={props.title} /> */}
      <div className="post-info">
        <h2>{props.title}</h2>
        <p>{props.description}</p>

        <p>
          <strong>Location:</strong> {props.location}
        </p>
        <p>
          <strong>Category:</strong> {props.category}
        </p>
        <button onClick={handleClickOpen}>Edit</button>

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
                // value={category}
                name="category"
                // onChange={handleChange}
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
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
            <button type="submit">Update</button>
          </DialogActions>
        </Dialog>
        <button>Delete</button>
        {/* <CommentsList postId={props.postId} userId={"currentUserId"} /> */}
      </div>
    </div>
  );
}
