import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import "./Post.css";

export function Post(props) {
  //   const postId = props.postId;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
  };
  // className="post-card"
  const handleDelete = () => {};
  return (
    <div className="post-card">
      {/* <img src={props.image} alt={props.title} /> */}
      <div className="post-info">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
        {/* <p>
          <strong>Location Name:</strong> {props.location.name}
        </p> */}
        <p>
          <strong>Location Name:</strong> {props.location}
        </p>
        {/* <p>
          <strong>Latitude:</strong> {props.location.lat}
        </p>
        <p>
          <strong>Longitude:</strong> {props.location.lng}
        </p> */}
        <p>
          <strong>Category:</strong> {props.category}
        </p>
        <button onClick={handleClickOpen}>Edit</button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          }}
        >
          <DialogTitle>Edit</DialogTitle>
          <DialogContent>
            <DialogContentText>Edit your post here</DialogContentText>
            <TextField
              autoFocus
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
            />
            <TextField
              autoFocus
              margin="dense"
              id="media"
              name="media"
              label="Media"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="category"
              name="category"
              label="Category"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              margin="dense"
              id="locationName"
              name="locationName"
              label="Location Name"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleClose}>Cancel</button>
            <button type="submit">Update</button>
          </DialogActions>
        </Dialog>
        <button>Delete</button>
      </div>
    </div>
  );
}
