import React from 'react';

function BookCard({ book }) {
  return (
    <div>
      <img src={book.imageUrl} alt={book.title} />
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
    </div>
  );
}

export default BookCard;