import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";

import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import "./SignIn.css";

// import {doCreateUserWithEmailAndPassword}
import { useState } from "react";
export function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwError, setPwError] = useState(false);

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

      // console.log(userInfo);
      const response = await fetch(postUrl, {
        method: "POST",
        // credentials: "include",
        headers: {
          "Content-Type": "appilication/json",
        },
        body: JSON.stringify({ name: username, email: userEmail }),
      });

      console.log(response);

      alert("New User Created");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <section>
      <div className="card">
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
            <button>Sign up</button>
            <button className="google-btn">
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </button>
          </div>

          <p>
            Already have an account? <a href="/login">Sign in</a>
          </p>
        </form>
      </div>
    </section>
  );
}
