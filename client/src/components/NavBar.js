import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          | <Link to="/user/books">My Book List</Link> |{' '}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default NavBar;