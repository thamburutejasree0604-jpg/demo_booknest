// Import necessary libraries and components
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.js"; // Import AuthContext to manage user authentication
import useAuthFetch from "../../utils/useAuthFetch.js"; // Custom hook for authenticated fetch requests
import BookDialog from "./BookDialog.js"; // Component for book creation/editing dialog
import DeleteDialog from "./DeleteDialog.js"; // Component for book deletion confirmation dialog
import classes from "./Inventory.module.css"; // Import CSS module for styling

// BooksTab component to manage the list of books and related actions
const BooksTab = () => {
  const [books, setBooks] = useState([]); // State to store the list of books
  const [isDialogOpen, setDialogOpen] = useState(false); // State to control the visibility of the book dialog
  const [dialogBook, setDialogBook] = useState(null); // State to store the book being edited
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // State to control the visibility of the delete dialog
  const [bookIdToDelete, setBookIdToDelete] = useState(null); // State to store the ID of the book to be deleted
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const { requestWithAuth } = useAuthFetch(); // Destructure requestWithAuth from the custom hook
  const { isAdmin } = useContext(AuthContext); // Destructure isAdmin from AuthContext to check if the user is an admin

  // Function to fetch the list of books from the server
  const fetchBooks = async (query = "") => {
    try {
      const response = await requestWithAuth(
        `http://localhost:8000/items?query=${encodeURIComponent(query)}`, // Fetch books with optional search query
        "GET"
      );
      setBooks(response); // Update the books state with the fetched data
    } catch (error) {
      console.error("Error fetching books: ", error);
    }
  };

  // useEffect to fetch books when the component mounts
  useEffect(() => {
    fetchBooks(); // Fetch all books initially
  }, []); // Empty dependency array ensures this runs only on mount

  // Function to handle search action
  const handleSearch = () => {
    fetchBooks(searchQuery); // Fetch books based on the search query
  };

  // Function to handle the creation of a new book
  const handleCreate = async (newBook) => {
    try {
      const response = await requestWithAuth(
        "http://localhost:8000/items/create", // API endpoint for creating a new book
        "POST",
        newBook // Send newBook data in the request body
      );
      fetchBooks(); // Refresh the book list after creation
      return response;
    } catch (error) {
      console.error("Error creating book: ", error);
    }
  };

  // Function to handle updating an existing book
  const handleUpdate = async (updatedBook) => {
    try {
      const response = await requestWithAuth(
        `http://localhost:8000/items/${updatedBook._id}`, // API endpoint for updating the book
        "PATCH",
        updatedBook // Send updatedBook data in the request body
      );
      fetchBooks(); // Refresh the book list after update
      return response;
    } catch (error) {
      console.error("Error updating book: ", error);
    }
  };

  // Function to open the edit dialog with the selected book data
  const handleEdit = (book) => {
    setDialogBook(book); // Set the book to be edited
    setDialogOpen(true); // Open the dialog
  };

  // Function to handle the deletion of a book
  const handleDelete = async (id) => {
    try {
      await requestWithAuth(`http://localhost:8000/items/${id}`, "DELETE"); // API endpoint for deleting the book
      setBooks((prev) => prev.filter((book) => book._id !== id)); // Remove the deleted book from the state
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };

  // Function to open the delete confirmation dialog
  const openDeleteDialog = (id) => {
    setBookIdToDelete(id); // Set the ID of the book to be deleted
    setDeleteDialogOpen(true); // Open the delete dialog
  };

  return (
    <div className={classes.bookListWrapper}>
      {/* Search and Create Book Section */}
      <div className={classes.searchContainer}>
        <input
          type="text"
          value={searchQuery} // Controlled component for search input
          onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
          placeholder="Search by title or author"
          className={classes.searchInput}
        />
        <button onClick={handleSearch} className={classes.searchButton}>
          Search
        </button>
        {/* Show Add New Book button only if the user is an admin */}
        {isAdmin && (
          <button
            className={classes.createButton}
            onClick={() => {
              setDialogBook(null); // Reset dialogBook state for a new book
              setDialogOpen(true); // Open the dialog for creating a new book
            }}
          >
            Add New Book
          </button>
        )}
      </div>

      {/* Book List Section */}
      <div className={classes.bookList}>
        {books.map((book) => (
          <div key={book._id} className={classes.bookItem}>
            <img
              src={book.cover}
              alt={book.title}
              className={classes.bookCover}
            />
            <div className={classes.bookDetails}>
              <h3 className={classes.bookTitle}>{book.title}</h3>
              <p className={classes.bookAuthor}>
                <em>{book.author}</em>
              </p>
              <br />
              <p className={classes.bookPrice}>
                Price: ${book.price.toFixed(2)} {/* Display price with two decimal places */}
              </p>
              <p className={classes.bookQty}>Quantity: {book.qty}</p>
            </div>
            {/* Show Edit and Delete buttons only if the user is an admin */}
            {isAdmin && (
              <div className={classes.bookActions}>
                <button
                  className={classes.editButton}
                  onClick={() => handleEdit(book)} // Open the edit dialog with the selected book
                >
                  Edit
                </button>
                <button
                  className={classes.deleteButton}
                  onClick={() => openDeleteDialog(book._id)} // Open the delete confirmation dialog
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conditionally render the BookDialog component if isDialogOpen is true */}
      {isDialogOpen && (
        <BookDialog
          onClose={() => setDialogOpen(false)} // Close the dialog
          onSubmit={dialogBook ? handleUpdate : handleCreate} // Determine whether to create or update a book
          book={dialogBook} // Pass the book data to the dialog
        />
      )}

      {/* Conditionally render the DeleteDialog component if isDeleteDialogOpen is true */}
      {isDeleteDialogOpen && (
        <DeleteDialog
          onClose={() => setDeleteDialogOpen(false)} // Close the delete dialog
          onDelete={handleDelete} // Handle book deletion
          bookId={bookIdToDelete} // Pass the ID of the book to be deleted
        />
      )}
    </div>
  );
};

// Export the BooksTab component for use in other parts of the app
export default BooksTab;
