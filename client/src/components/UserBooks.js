import React from 'react';
import './BookCard.css';

const UserBooks = ({ userBooks, onRemoveFromMyList }) => {
  return (
    <div className="user-books-container">
      {userBooks.length === 0 ? (
        <div className="empty-list-message">
          <p>Your Book List is currently empty. To add some books, go to the <a href="/">home page</a>.</p>
        </div>
      ) : (
        userBooks.map(book => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} />
            <div className="book-card-content">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.genre.genre}</p>
              <button onClick={() => onRemoveFromMyList(book.id)}>Remove from My List</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserBooks;