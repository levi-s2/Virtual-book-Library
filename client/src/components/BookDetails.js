import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/books/${id}`);
        setBook(response.data);
        setReviews(response.data.reviews || []);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };
    fetchBook();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(
          'http://localhost:5000/reviews',
          { book_id: book.id, review },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews([...reviews, { body: review }]);
        setReview('');
        setReviewFormVisible(false);
      } catch (error) {
        console.error('Error adding review:', error);
      }
    } else {
      alert('You need to be logged in to add a review.');
    }
  };

  return (
    <div>
      {book ? (
        <>
          <h2>{book.title}</h2>
          <img src={book.image_url} alt={book.title} />
          <p>{book.description}</p>
          <h3>Reviews</h3>
          <button onClick={() => setReviewFormVisible(true)}>Add a Review</button>
          {isReviewFormVisible && (
            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review here"
              />
              <button type="submit">Submit Review</button>
            </form>
          )}
          <ul>
            {reviews.map((r, index) => (
              <li key={index}>{r.body}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default BookDetails;