import React from 'react';
import { Link } from 'react-router-dom';
import './css/NavBar.css';

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/user/books">My Book List</Link>
      <Link to="/user/reviews"> My Reviews</Link>
      <Link to="/recommendations">Recommendations</Link>
      <Link to="/about">About Us</Link>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;