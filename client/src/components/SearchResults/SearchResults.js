import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import classes from "./SearchResults.module.css";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortPrice, setSortPrice] = useState(""); // State to manage selected sort option
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        let url = `http://localhost:8000/items?query=${query}`;

        if (sortPrice) {
          url += `&sortPrice=${sortPrice}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query, sortPrice]);

  const handleResultClick = (slug) => {
    navigate(`/items/${slug}`);
  };

  return (
    <div>
      <div className={classes.filterContainer}>
        <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)} className={classes.filterSelect}>
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className={classes.resultsList}>
        {searchResults.length === 0 ? (
          <div>
          <p>No results found.</p>
          <Link to="/">Go Back to Home</Link>
          </div>
        ) : (
          searchResults.map((book) => (
            <div
              key={book._id}
              className={classes.resultItem}
              onClick={() => handleResultClick(book.slug)}
            >
              <img src={book.cover} alt={book.title} className={classes.resultCover} />
              <div className={classes.resultDetails}>
                <h3 className={classes.resultTitle}>{book.title}</h3>
                <p className={classes.resultAuthor}>{book.author}</p>
                <p className={classes.resultPrice}>${book.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchResults;