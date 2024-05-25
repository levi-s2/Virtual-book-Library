import React from 'react';
import './BookCard.css';
import './HomePage.css'; 

const HomePage = ({ onSearch, books, searchTerm, onAddToMyList, userBooks, genres, selectedGenre, onGenreChange }) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleGenreChange = (e) => {
    onGenreChange(e.target.value);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre ? book.genre.id === parseInt(selectedGenre) : true;
    return matchesSearchTerm && matchesGenre;
  });

  return (
    <div className="home-page">
      <div className="search-bar-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select value={selectedGenre} onChange={handleGenreChange}>
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.genre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="book-list">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image_url} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
            <button
              onClick={() => onAddToMyList(book.id)}
              disabled={userBooks.some((userBook) => userBook.id === book.id)}
            >
              {userBooks.some((userBook) => userBook.id === book.id)
                ? 'Added to List'
                : 'Add to My List'}
            </button>
            <button
              onClick={() => window.location.href = `/books/${book.id}`}
            >
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;