import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the books!", error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="book-list">
        {filteredBooks.map(book => (
          <div key={book.id} className="book-card">
            <Link to={`/books/${book.id}`}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <img src={book.image_url} alt={book.title} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;