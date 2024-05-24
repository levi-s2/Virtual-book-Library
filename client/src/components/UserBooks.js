import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const UserBooks = ({ userBooks, onRemoveFromMyList }) => {
  return (
    <div className="user-books-container">
      {userBooks.length > 0 ? (
        userBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <Link to={`/books/${book.id}`}>
              <button>Add a Review</button>
            </Link>
            <button onClick={() => onRemoveFromMyList(book.id)}>Remove from List</button>
          </div>
        ))
      ) : (
        <div className="empty-list-message">
          <p>Your Book List is currently empty, to add some books, go to the <Link to="/">home page</Link></p>
        </div>
      )}
    </div>
  );
};

export default UserBooks;