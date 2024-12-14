import { useContext } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from "../context/AuthContext";
import { doSignInWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import "./SignIn.css";

export function SignIn() {
  const { currentUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    let { email, password } = e.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;
    if (email) {
      doPasswordReset(email);
      alert("Password reset email was sent");
    } else {
      alert("Please enter your email address to reset your password");
    }
  };

  return (
    <section>
      <div className="card">
        <p className="text-large">Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <a className="text-medium" onClick={resetPassword}>
              Forgot password?
            </a>
          </div>
          <div>
            <button className="text-medium">Login</button>
            <button className="google-btn">
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </button>
          </div>
          <p className="text-muted">
            Don’t have an account yet?{" "}
            <a className="link-primary" href="/signup">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
