import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import library from "../../assets/library.jpg";
import classes from "./MainImage.module.css";

const MainImage = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <div className={classes.mainImage}>
      <img
        src={library}
        alt="books in a library"
        className={classes.libraryImage}
      />
      <div className={classes.textOverlay}>Welcome to the BookNest</div>
      <div className={classes.searchContainer}>
        <input
          type="text"
          className={classes.searchInput}
          placeholder="Search by title / author ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className={classes.searchButton} onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default MainImage;
