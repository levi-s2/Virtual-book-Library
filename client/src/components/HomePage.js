import React from 'react';
import './BookCard.css';

const HomePage = ({ books, searchTerm, onSearch, onAddToMyList, userBooks }) => {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  const isBookInList = (bookId) => {
    return userBooks.some(book => book.id === bookId);
  };

  return (
    <div className="homepage-container">
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="book-list">
        {books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} />
            <div className="book-card-content">
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <p>{book.genre.genre}</p>
              <button 
                onClick={() => onAddToMyList(book.id)}
                disabled={isBookInList(book.id)}
              >
                {isBookInList(book.id) ? 'Added to My List' : 'Add to My List'}
              </button>
              <button 
                onClick={() => window.location.href = `/books/${book.id}`}
              >
                See More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;