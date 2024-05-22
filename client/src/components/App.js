import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import HomePage from './HomePage';
import Register from './Register';
import Login from './Login';
import UserBooks from './UserBooks';
import BookDetails from './BookDetails';
import NavBar from './NavBar';

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:5000/books').then((response) => {
      setBooks(response.data);
    }).catch((error) => {
      console.error('Error fetching books:', error);
    });

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBooks();
    }
  }, [user]);

  const fetchUserBooks = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/user/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserBooks(response.data);
    } catch (error) {
      console.error('Error fetching user books:', error);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRegister = async (name, password) => {
    try {
      const response = await axios.post('http://localhost:5000/register', { name, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Registration response:', response);
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  const handleLogin = async (name, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { name, password });
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      const decoded = jwtDecode(access_token);
      setUser(decoded);
      alert('Login successful!');
      history.push('/');
    } catch (error) {
      alert('Login failed: ' + error.response.data.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserBooks([]);
    alert('Logged out successfully!');
  };

  const addToMyList = async (bookId) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:5000/user/books`,
          { bookId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserBooks([...userBooks, books.find(book => book.id === bookId)]);
      } catch (error) {
        console.error('Error adding book to list:', error);
        // Optional: handle specific error scenarios
      }
    } else {
      alert('You need to be logged in to add books to your list.');
    }
  };

  const removeFromMyList = async (bookId) => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(
          `http://localhost:5000/user/books/${bookId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserBooks(userBooks.filter(book => book.id !== bookId));
      } catch (error) {
        console.error('Error removing book from list:', error);
        alert('Failed to remove book from list.');
      }
    } else {
      alert('You need to be logged in to remove books from your list.');
    }
  };

  return (
    <Router>
      <div>
        <NavBar user={user} handleLogout={handleLogout} />
        <Switch>
          <Route path="/" exact>
            <>
              <HomePage 
                onSearch={handleSearch} 
                books={books} 
                searchTerm={searchTerm} 
                onAddToMyList={addToMyList} 
                userBooks={userBooks} 
              />
            </>
          </Route>
          <Route path="/books/:id" exact>
            <BookDetails />
          </Route>
          <Route path="/register">
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/user/books">
            {user ? <UserBooks userBooks={userBooks} onRemoveFromMyList={removeFromMyList} /> : <Login onLogin={handleLogin} />}
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;