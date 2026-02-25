import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Books.module.css"; 

const Books = ({ searchTerm }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books from the Db via API call
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/items");
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        // Initially, show all books
        setBooks(data);
        setFilteredBooks(data); 
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this runs once after the initial render

  useEffect(() => {
    if (searchTerm) {
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(books); // Show all books if search term is empty
    }
  }, [searchTerm, books]);

  const handleBookClick = (slug) => {
    navigate(`/items/${slug}`);
  };

  return (
    <div className={classes.bookList}>
      {filteredBooks.map((book) => (
        <div
          key={book._id}
          className={classes.bookItem}
          onClick={() => handleBookClick(book.slug)}
        >
          <img src={book.cover} alt={book.title} className={classes.bookCover} />
          <div className={classes.bookDetails}>
            <h3 className={classes.bookTitle}>{book.title}</h3>
            <p className={classes.bookAuthor}>{book.author}</p>
            <p className={classes.bookPrice}>${book.price.toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Books;
