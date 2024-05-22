import React from 'react';
import { useHistory } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book, onAddToMyList, isInList }) => {
  const history = useHistory();

  const handleSeeMoreClick = () => {
    history.push(`/books/${book.id}`);
  };

  return (
    <div className="book-card">
      <img src={book.image_url} alt={book.title} />
      <div className="book-card-content">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p>{book.genre.genre}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToMyList(book.id);
          }}
          disabled={isInList}
        >
          {isInList ? 'Added to My List' : 'Add to My List'}
        </button>
        <button onClick={handleSeeMoreClick}>
          See More
        </button>
      </div>
    </div>
  );
};

export default BookCard;