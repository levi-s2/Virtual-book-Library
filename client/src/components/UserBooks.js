import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const UserBooks = ({ userBooks }) => {
  return (
    <div className="book-card-container">
      {userBooks.length > 0 ? (
        userBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} />
            <div className="book-card-content">
              <div className="book-card-title">{book.title}</div>
              <div className="book-card-author">by {book.author}</div>
              <div className="book-card-genre">{book.genre.genre}</div>
              <Link to={`/books/${book.id}`}>View Details</Link>
            </div>
          </div>
        ))
      ) : (
        <p>No books in your list yet.</p>
      )}
    </div>
  );
};

export default UserBooks;