import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ books, searchTerm }) => {
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredBooks.length === 0) {
    return <p>No books found.</p>;
  }

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {filteredBooks.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} style={{ width: '100px' }} />
              ) : (
                <p>No Image Available</p>
              )}
              <p>{book.title}</p>
              <p>{book.author}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookCard;