import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import { SignUp } from "./pages/SignUp";
import { AuthProvider } from "./context/AuthContext";
import { SignIn } from "./pages/SignIn";
import { UserPage } from "./pages/UserPage";
// import { SideBar } from "./components/SideBar";
import { ErrorNotFound } from "./pages/ErrorNotFound";

function App() {
  return (
    //   <Router>
    //   <div className="navbar">
    //     <div className="logo">
    //     <a href="/">
    //       <h1>Explore Diaries</h1>
    //     </a>
    //     </div>
    //     <div className="auth-links">
    //       <Link to="/login" className="auth-link">Login</Link>
    //       <Link to="/signup" className="auth-link">Sign Up</Link>
    //     </div>
    //   </div>
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     {/* Add Login and Sign Up Routes here if needed */}
    //   </Routes>
    // </Router>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/errornotfound" element={<ErrorNotFound />} />
          {/* Add Login and Sign Up Routes here if needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
