import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import classes from "./BookDetail.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);

  const genreMap = [
    "Uncategorized",
    "Fiction",
    "Mystery",
    "Romance",
    "Science Fiction",
    "Fantasy",
    "Historical Fiction",
    "Thriller",
    "Non-Fiction",
    "Biography",
  ];

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`http://localhost:8000/items/${slug}`);

        if (response.status === 404) {
          throw new Error("Book not found");
        }

        if (!response.ok) {
          throw new Error("An error occurred");
        }

        const data = await response.json();
        setBook(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching book: ", error);
        setError(error.message);

        if (error.message === "Book not found") {
          navigate("/404");
        } else {
          navigate("/error");
        }
      }
    };

    fetchBook();
  }, [slug, navigate]);

  const addToCartHandler = () => {
    console.log("Adding to cart:", book);
    if (book && book.qty > 0) {
      cartCtx.addItem({ ...book, quantity: 1 });
      toast.success("Item added to cart!");
      console.log("Item added to cart:", book);
    }
  };

  if (error) return null; // render nothing while redirecting

  if (!book) return <h2>Loading...</h2>; // show a loading message when loading

  const genreLabel = genreMap[book.genre] || "Unknown Genre";
  let stockStatus = "";
  let buttonDisabled = false;

  if (book.qty <= 0) {
    stockStatus = "Out of Stock";
    buttonDisabled = true;
  } else if (book.qty <= 5) {
    stockStatus = "Low on Stock";
  }

  return (
    <div className={classes.bookDetail}>
      <img
        src={book.cover}
        alt={book.title}
        className={classes.bookCoverDetail}
      />
      <div className={classes.bookInfo}>
        <div className={classes.tagsContainer}>
          <span className={classes.genreTag}>{genreLabel}</span>
          {stockStatus && (
            <span className={classes.stockTag}>{stockStatus}</span>
          )}
        </div>
        <h1>{book.title}</h1>
        <p>
          <strong>Author : {book.author}</strong>
        </p>
        <p>
          <strong>Price : ${book.price}</strong>
        </p>
        <p>
          <em>{book.description}</em>
        </p>
        <p>{book.details}</p>
        <button
          onClick={addToCartHandler}
          className={classes["add-to-cart-button"]}
          disabled={buttonDisabled}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default BookDetail;
