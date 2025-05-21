// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Search from './Search';

function App() {
  // Generate a random user ID on first load and store it in localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      const newId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', newId);
      console.log('New user ID generated:', newId);
    } else {
      console.log('Existing user ID:', userId);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;



