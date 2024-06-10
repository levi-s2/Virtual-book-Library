import React, { useState, useEffect } from 'react';
import axios from "./axiosConfig";
import { useParams } from 'react-router-dom';
import './css/BookDetails.css';
import { jwtDecode } from 'jwt-decode';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import StarRatingComponent from 'react-star-rating-component';

const BookDetails = ({ onAddToMyList, userBooks, ratings, updateRating }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isReviewFormVisible, setReviewFormVisible] = useState(false);
  const [userReviewExists, setUserReviewExists] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/books/${id}`);
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

  const handleReviewSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          '/reviews',
          { book_id: book.id, review: values.review },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const newReview = response.data.review;
        setReviews([...reviews, newReview]);
        setReviewFormVisible(false);
        setUserReviewExists(true);
        resetForm();
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

  const validationSchema = Yup.object().shape({
    review: Yup.string()
      .min(10, 'Review must be at least 10 characters long')
      .required('Review is required')
  });

  const onStarClick = async (nextValue) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.patch(
          `/user/books/${id}`,
          { rating: nextValue },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        updateRating(book.id, nextValue);
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    } else {
      alert('You need to be logged in to rate a book.');
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
            <button
              onClick={() => onAddToMyList(book.id)}
              disabled={userBooks.some((userBook) => userBook.id === book.id)}
            >
              {userBooks.some((userBook) => userBook.id === book.id)
                ? 'Added to List'
                : 'Add to My List'}
            </button>
            {userBooks.some((userBook) => userBook.id === book.id) && (
              <div className="rating">
                <h3>Rate this book:</h3>
                <StarRatingComponent 
                  name="bookRating" 
                  starCount={5}
                  value={ratings[book.id] || 0}
                  onStarClick={onStarClick}
                />
              </div>
            )}
          </div>
          <div className="reviews-section">
            <h3>Reviews</h3>
            {!userReviewExists && (
              <button className="add-review-button" onClick={() => setReviewFormVisible(true)}>
                Add a Review
              </button>
            )}
            {isReviewFormVisible && (
              <Formik
                initialValues={{ review: '' }}
                validationSchema={validationSchema}
                onSubmit={handleReviewSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="review-form">
                    <Field as="textarea" name="review" placeholder="Write your review here" />
                    <ErrorMessage name="review" component="div" className="error-message" />
                    <button type="submit" disabled={isSubmitting}>Submit Review</button>
                  </Form>
                )}
              </Formik>
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
