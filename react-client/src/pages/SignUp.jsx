import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import {
  doCreateUserWithEmailAndPassword,
  getUid,
} from "../firebase/FirebaseFunctions";
import "./SignIn.css";
import { useState } from "react";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import { Divider } from "@mui/material";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwError, setPwError] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, passwordConfirm } = e.target.elements;
    console.log(name.value, email.value, password.value, passwordConfirm.value);
    if (password.value != passwordConfirm.value) {
      setPwError(true);
      return;
    }
    setPwError(false);

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        password.value,
        name.value
      );
      const postUrl = "http://localhost:3000/api/auth/signup";
      const username = name.value;
      const userEmail = email.value;
      const fireId = await getUid();

      const response = await axios.post(
        postUrl,
        { name: username, email: userEmail, fireId: fireId },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
          },
        }
      );

      alert("New User Created");
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  const googleLogin = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;
      if (!currentUser) {
        throw new Error("Google sign-in failed. User not found.");
      }

      const fireId = currentUser.uid;
      const email = currentUser.email;
      const displayName = currentUser.displayName;
      const postUrl = "http://localhost:3000/api/auth/signup";
      const response = await axios.post(
        postUrl,
        { name: displayName, email: email, fireId: fireId },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "application/json",
          },
        }
      );

      alert("You are logged in!");
      navigate("/");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section>
      <div className="card">
        <p className="text-large">Create your account</p>
        <form onSubmit={handleSignup}>
          <div>
            <label>Name:</label>
            <input
              type="name"
              name="name"
              id="name"
              placeholder="Name"
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="••••••••"
              required
            />
            {pwError && <p>Passwords do not match</p>}
          </div>

          <div>
            <button type="submit">Sign up</button>
          </div>
        </form>
        <Divider />
        <button className="google-btn" onClick={() => googleLogin()}>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <p>
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </section>
  );
}
