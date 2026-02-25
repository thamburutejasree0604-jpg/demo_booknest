import React from 'react';
import { Link } from 'react-router-dom';
import classes from './NotFound.module.css';

// provide a fallback UI when user tries to access an undefined route
const NotFound = () => {
  return (
    <div className={classes.notFound}>
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to="/">Go Back to Home</Link>
    </div>
  );
};

export default NotFound;
