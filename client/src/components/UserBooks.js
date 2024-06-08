import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import axios from './axiosConfig';

const UserBooks = ({ userBooks, onRemoveFromMyList }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userBooks) {
      setLoading(false);
    }
  }, [userBooks]);

  const handleRatingChange = async (bookId, rating) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/user/books/${bookId}`,
        { rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div className="user-books-container">
      {loading ? (
        <ClipLoader size={50} color={"#007bff"} />
      ) : (
        userBooks.length === 0 ? (
          <div className="empty-list-message">
            <p>Your book list is currently empty. To add some books, go to <Link to="/">home page</Link>.</p>
          </div>
        ) : (
          userBooks.map(book => (
            <div key={book.id} className="book-card">
              <img src={book.image_url} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
              <label>
                Rating:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={book.rating || ''}
                  onChange={(e) => handleRatingChange(book.id, e.target.value)}
                />
              </label>
              <button onClick={() => onRemoveFromMyList(book.id)}>Remove from List</button>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default UserBooks;
