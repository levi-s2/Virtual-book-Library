import React, { useState, useEffect } from 'react';
import axios from "./axiosConfig";
import { useParams } from 'react-router-dom';
import './css/BookDetails.css';
import { jwtDecode } from 'jwt-decode';

const BookDetails = ({ onAddToMyList }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [userReviewExists, setUserReviewExists] = useState(false);
  const [rating, setRating] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
        setReviews(response.data.reviews || []);

        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const userId = decoded.identity;
          const userReview = response.data.reviews.find(r => r.user.id === userId);
          if (userReview) {
            setUserReviewExists(true);
          }
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToMyList = async () => {
    if (rating.trim() === '') {
      alert('Rating cannot be empty');
      return;
    }
    onAddToMyList(book.id, rating);
  };
  

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review.trim() === '') {
      alert('Review cannot be empty');
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'http://localhost:5000/reviews',
          { book_id: book.id, review },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newReview = response.data.review;
        setReviews([...reviews, newReview]);
        setReview('');
        setReviewFormVisible(false);
        setUserReviewExists(true);
        window.location.reload();
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error('Error adding review:', error);
        }
      }
    } else {
      alert('You need to be logged in to add a review.');
    }
  };

  return (
    <div className="book-details-container">
      {book ? (
        <>
          <div className="book-card">
            <img className="book-image" src={book.image_url} alt={book.title} />
            <h2>{book.title}</h2>
            <p>{book.author}</p>
            <label>
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
            <button className="add-to-list-button" onClick={handleAddToMyList}>Add to My List</button>
          </div>
          <div className="reviews-section">
            <h3>Reviews</h3>
            {!userReviewExists && (
              <button className="add-review-button" onClick={() => setReviewFormVisible(true)}>
                Add a Review
              </button>
            )}
            {isReviewFormVisible && (
              <form className="review-form" onSubmit={handleReviewSubmit}>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review here"
                />
                <button type="submit">Submit Review</button>
              </form>
            )}
            <ul className="reviews-list">
              {reviews.map((r, index) => (
                <li key={index} className="review-item">
                  <p><strong>{r.user?.name}:</strong> {r.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BookDetails;
