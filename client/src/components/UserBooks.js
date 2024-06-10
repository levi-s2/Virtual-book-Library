import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link, useHistory } from 'react-router-dom';
import axios from './axiosConfig';
import StarRatingComponent from 'react-star-rating-component';

const UserBooks = ({ userBooks, onRemoveFromMyList, ratings, updateRating }) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (userBooks) {
      setLoading(false);
    }
  }, [userBooks]);

  const handleStarClick = async (nextValue, bookId) => {
    updateRating(bookId, nextValue);

    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `http://localhost:5000/user/books/${bookId}`,
        { rating: nextValue },
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

  const handleAddReview = (bookId) => {
    history.push(`/books/${bookId}`);
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
              <div className="rating">
                <h4>Rating:</h4>
                <StarRatingComponent 
                  name={`bookRating-${book.id}`} 
                  starCount={5}
                  value={ratings[book.id] || 0}
                  onStarClick={(nextValue) => handleStarClick(nextValue, book.id)}
                />
              </div>
              <button onClick={() => handleAddReview(book.id)}>Add a Review</button>
              <button onClick={() => onRemoveFromMyList(book.id)}>Remove from List</button>
            </div>
          ))
        )
      )}
    </div>
  );
};

export default UserBooks;
