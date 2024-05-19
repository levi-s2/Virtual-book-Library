import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBooks = ({ user }) => {
  const [userBooks, setUserBooks] = useState([]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      axios
        .get('http://localhost:5000/user/books', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setUserBooks(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user books:', error);
        });
    }
  }, [user]);

  if (!user) {
    return <div>Please log in to view your books.</div>;
  }

  return (
    <div>
      <h2>My Books</h2>
      <ul>
        {userBooks.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserBooks;