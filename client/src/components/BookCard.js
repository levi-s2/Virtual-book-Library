import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ books, searchTerm, onAddToMyList }) => {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="book-card-container">
      {filteredBooks.map((book) => (
        <div key={book.id} className="book-card">
          <img src={book.image_url} alt={book.title} />
          <div className="book-card-content">
            <div className="book-card-title">{book.title}</div>
            <div className="book-card-author">by {book.author}</div>
            <div className="book-card-genre">{book.genre.genre}</div>
            <Link to={`/books/${book.id}`}>View Details</Link>
            <button onClick={() => onAddToMyList(book.id)}>Add to My List</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookCard;