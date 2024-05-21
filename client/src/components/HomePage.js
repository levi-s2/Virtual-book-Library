import React from 'react';

const HomePage = ({ onSearch }) => {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div>
      <h1>Welcome to the Book Store</h1>
      <input
        type="text"
        placeholder="Search for books..."
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default HomePage;