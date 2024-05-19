import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/books/${id}`)
      .then(response => {
        setBook(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the book details!", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>No book found!</p>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <h2>{book.author}</h2>
      <img src={book.image_url} alt={book.title} />
      <p>Genre: {book.genre.genre}</p>
      <h3>Reviews</h3>
      <ul>
        {book.reviews.map(review => (
          <li key={review.id}>{review.body}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookDetails;