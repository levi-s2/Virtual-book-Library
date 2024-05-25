import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About Us</Link>
      <Link to="/recommendations">Recommendations</Link>
      {user ? (
        <>
          <Link to="/user/books">My Book List</Link>
          <Link to="/user/reviews">Reviews</Link>
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