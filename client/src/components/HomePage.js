import React, { useState, useEffect } from 'react';
import BookCard from './BookCard';
import NavBar from './NavBar';
import axios from 'axios';

function HomePage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from API
    axios.get('http://localhost:3001/books')
      .then(response => setBooks(response.data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div>
      <NavBar />
      <div>
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;