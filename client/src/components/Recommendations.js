import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './css/Recommendations.css';

const Recommendations = ({ user }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleRecommendationSubmit = async (values, { resetForm }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          'http://localhost:5000/recommendations',
          { title: values.title, author: values.author },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecommendations([...recommendations, response.data]);
        resetForm();
      } catch (error) {
        console.error('Error submitting recommendation:', error);
      }
    } else {
      alert('You need to be logged in to submit a recommendation.');
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required('Book title is required')
      .min(3, 'Title must be at least 3 characters long'),
    author: Yup.string()
      .required('Author is required')
      .min(3, 'Author must be at least 3 characters long')
  });

  return (
    <div className="recommendations-container">
      <h2>Book Recommendations</h2>
      {user ? (
        <Formik
          initialValues={{ title: '', author: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRecommendationSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <Field
                  type="text"
                  name="title"
                  placeholder="Book Title"
                />
                <ErrorMessage name="title" component="div" className="error-message" />
              </div>
              <div>
                <Field
                  type="text"
                  name="author"
                  placeholder="Author"
                />
                <ErrorMessage name="author" component="div" className="error-message" />
              </div>
              <button type="submit" disabled={isSubmitting}>Submit Recommendation</button>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Please log in to submit a recommendation.</p>
      )}
      <div className="recommendations-list">
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <h3>{rec.title}</h3>
            <p>{rec.author}</p>
            <p>Recommended by: {rec.user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
