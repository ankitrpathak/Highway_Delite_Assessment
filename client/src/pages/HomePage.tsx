import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header>
        <h1>Welcome to Notes App</h1>
        <p>Your personal note-taking companion</p>
      </header>
      
      <main>
        <div className="action-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
