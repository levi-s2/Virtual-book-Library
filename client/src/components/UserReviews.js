import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './UserReviews.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewBody, setEditReviewBody] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/user/reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data);
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/user/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setReviews(reviews.filter((review) => review.id !== reviewId));
  };

  const handleEdit = (reviewId, reviewBody) => {
    setEditingReviewId(reviewId);
    setEditReviewBody(reviewBody);
  };

  const handleSaveEdit = async (reviewId) => {
    const token = localStorage.getItem('token');
    await axios.patch(
      `http://localhost:5000/user/reviews/${reviewId}`,
      { body: editReviewBody },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    setReviews(
      reviews.map((review) => 
        review.id === reviewId ? { ...review, body: editReviewBody } : review
      )
    );
    setEditingReviewId(null);
    setEditReviewBody('');
  };

  return (
    <div className="user-reviews-container">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.book.title}</h3>
            {editingReviewId === review.id ? (
              <>
                <textarea
                  value={editReviewBody}
                  onChange={(e) => setEditReviewBody(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(review.id)}>Save</button>
              </>
            ) : (
              <>
                <p>{review.body}</p>
                <button onClick={() => handleEdit(review.id, review.body)}>Edit</button>
                <button onClick={() => handleDelete(review.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      ) : (
        <div className="empty-list-message">
          <p>Your review list is currently empty. To add some reviews, go to <Link to="/">home page</Link> and chose a book.</p>
        </div>
      )}
    </div>
  );
};

export default UserReviews;