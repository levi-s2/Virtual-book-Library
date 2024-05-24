import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import './BookCard.css';

const UserBooks = ({ userBooks, onRemoveFromMyList }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userBooks) {
      setLoading(false);
    }
  }, [userBooks]);

  return (
    <div className="user-books-container">
      {loading ? (
        <ClipLoader size={50} color={"#007bff"} />
      ) : (
        userBooks.length === 0 ? (
          <div className="empty-list-message">
            <p>Your book list is currently empty. To add some books, go to <Link to="/">home page</Link>.</p>
          </div>
        ) : (
          userBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.image_url} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <button onClick={() => onRemoveFromMyList(book.id)}>Remove from List</button>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default UserBooks;