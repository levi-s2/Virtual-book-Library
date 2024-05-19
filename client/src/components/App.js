import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import HomePage from './HomePage';
import BookCard from './BookCard';
import Register from './Register';
import Login from './Login';
import UserBooks from './UserBooks';

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:5555/books').then((response) => {
      setBooks(response.data);
    }).catch((error) => {
      console.error('Error fetching books:', error);
    });
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleRegister = async (name, password) => {
    try {
      await axios.post('http://localhost:5555/register', { name, password });
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed: ' + error.response.data.message);
    }
  };

  const handleLogin = async (name, password) => {
    try {
      const response = await axios.post('http://localhost:5555/login', { name, password });
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
    alert('Logged out successfully!');
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link> | <Link to="/books">Books</Link>
          {user ? (
            <>
              | <Link to="/user/books">My Books</Link> |{' '}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              | <Link to="/register">Register</Link> | <Link to="/login">Login</Link>
            </>
          )}
        </nav>
        <Switch>
          <Route path="/" exact>
            <HomePage onSearch={handleSearch} />
          </Route>
          <Route path="/books" exact>
            <BookCard books={books} searchTerm={searchTerm} />
          </Route>
          <Route path="/books/:id" exact>
            <BookCard />
          </Route>
          <Route path="/register">
            <Register onRegister={handleRegister} />
          </Route>
          <Route path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route path="/user/books">
            <UserBooks user={user} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;