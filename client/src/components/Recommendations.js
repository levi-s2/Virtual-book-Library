import React, { useState, useEffect } from 'react';
import axios from './axiosConfig';
import './css/Recommendations.css';

const Recommendations = ({ user }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleRecommendationSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.post(
          '/recommendations',
          { title, author },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRecommendations([...recommendations, response.data]);
        setTitle('');
        setAuthor('');
      } catch (error) {
        console.error('Error submitting recommendation:', error);
      }
    } else {
      alert('You need to be logged in to submit a recommendation.');
    }
  };

  return (
    <div className="recommendations-container">
      <h2>Book Recommendations</h2>
      <div className="recommendations-list">
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <h3>{rec.title}</h3>
            <p>{rec.author}</p>
            <p>Recommended by: {rec.user.name}</p>
          </div>
        ))}
      </div>
      {user ? (
        <form onSubmit={handleRecommendationSubmit}>
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <button type="submit">Submit Recommendation</button>
        </form>
      ) : (
        <p>Please log in to submit a recommendation.</p>
      )}
    </div>
  );
};

export default Recommendations;
