import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav>
      <div>
        <Link to="/">Book Store</Link>
      </div>
      <div>
        <Link to="/books">Books</Link>
      </div>
    </nav>
  );
}

export default NavBar