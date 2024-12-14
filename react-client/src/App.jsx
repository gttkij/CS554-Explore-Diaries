import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage.jsx';

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className="logo">
        <a href="/">
          <h1>Explore Diaries</h1>
        </a>
        </div>
        <div className="auth-links">
          <Link to="/login" className="auth-link">Login</Link>
          <Link to="/signup" className="auth-link">Sign Up</Link>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add Login and Sign Up Routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
