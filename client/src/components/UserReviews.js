import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserReviews.css';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);

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
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="user-reviews-container">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <h3>{review.book.title}</h3>
            <p>{review.body}</p>
          </div>
        ))
      ) : (
        <div className="empty-reviews-message">
          <p>You haven't added any reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserReviews;