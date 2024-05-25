import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader';
import { Link } from 'react-router-dom';
import './UserReviews.css';

const UserReviews = ({ user }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewBody, setEditReviewBody] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/user/reviews', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user reviews:', error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/user/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditReview = (reviewId) => {
    setEditingReviewId(reviewId);
    const reviewToEdit = reviews.find(review => review.id === reviewId);
    setEditReviewBody(reviewToEdit.body);
  };

  const handleUpdateReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`http://localhost:5000/user/reviews/${reviewId}`, {
        body: editReviewBody,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(reviews.map(review => (review.id === reviewId ? { ...review, body: editReviewBody } : review)));
      setEditingReviewId(null);
      setEditReviewBody('');
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="user-reviews-container">
      {loading ? (
        <ClipLoader size={50} color={"#007bff"} />
      ) : (
        reviews.length === 0 ? (
          <div className="empty-reviews-message">
            <p>Your review list is currently empty. To add some reviews, go to <Link to="/">home page</Link> and choose a book.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <h3>{review.book.title}</h3>
              {editingReviewId === review.id ? (
                <>
                  <textarea
                    value={editReviewBody}
                    onChange={(e) => setEditReviewBody(e.target.value)}
                  />
                  <button onClick={() => handleUpdateReview(review.id)}>Update Review</button>
                  <button onClick={() => setEditingReviewId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{review.body}</p>
                  <button onClick={() => handleEditReview(review.id)}>Edit</button>
                  <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )
      )}
    </div>
  );
};

export default UserReviews;