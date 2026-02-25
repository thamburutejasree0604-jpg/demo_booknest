import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Error.module.css';

// general error page (errors other than 404)
const Error = ({ message }) => {
  return (
    <div className={classes.error}>
      <h1>Something went wrong</h1>
      <p>{message || 'We are unable to process your request at the moment.'}</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default Error;
