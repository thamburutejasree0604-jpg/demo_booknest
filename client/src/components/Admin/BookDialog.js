import React, { useState, useEffect } from "react";
import classes from "./BookDialog.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookDialog = ({ onClose, onSubmit, book }) => {
  const [formData, setFormData] = useState({
    cover: "",
    title: "",
    author: "",
    price: "",
    description: "",
    details: "",
    genre: "",
    qty: "",
  });

  useEffect(() => {
    if (book) {
      setFormData({
        cover: book.cover || "",
        title: book.title || "",
        author: book.author || "",
        price: book.price || "",
        description: book.description || "",
        details: book.details || "",
        genre: book.genre || "",
        qty: book.qty || "",
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedData = {
      ...formData,
      cover: formData.cover.trim(),
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      details: formData.details.trim(),
      genre: parseInt(formData.genre, 10),
      qty: parseInt(formData.qty, 10),
    };

    const { cover, title, author, price, genre, qty } = trimmedData;
    // validate required fields
    if (!cover || !title || !author || !price || !genre || !qty) {
      toast.error(
        "Cover, title, author, price, genre, and quantity are required."
      );
      return;
    }

    try {
        if (book) {
          // Updating an existing book
          await onSubmit({ ...trimmedData, _id: book._id });
        } else {
          // Creating a new book
          await onSubmit(trimmedData);
        }
        toast.success(book ? "Book updated successfully!" : "Book added successfully!");
      } catch (error) {
        toast.error("Failed to save the book. Please try again.");
      }

    onClose();
  };

  return (
    <div className={classes.dialog}>
      <span className={classes.closeButton} onClick={onClose}>
        &times;
      </span>
      <div className={classes.dialogContent}>
        <div className={classes.coverContainer}>
          {formData.cover ? (
            <img
              src={formData.cover}
              alt="Cover preview"
              className={classes.coverPreview}
            />
          ) : (
            <span className={classes.noCoverMessage}>No cover preview</span>
          )}
        </div>
        <form onSubmit={handleSubmit} className={classes.form}>
          {[
            { field: "cover", required: true },
            { field: "title", required: true },
            { field: "author", required: true },
            { field: "price", required: true },
            { field: "description", required: false },
            { field: "details", required: false },
            { field: "genre", required: true },
            { field: "qty", required: true },
          ].map(({ field, required }) => (
            <div className={classes.formRow} key={field}>
              <label className={classes.formLabel}>
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1") +
                  ":"}
              </label>
              {field === "description" || field === "details" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={classes.formInput}
                  required={required}
                />
              ) : field === "genre" ? (
                <select
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={classes.formInput}
                  required={required}
                >
                  <option value="0">Uncategorized</option>
                  <option value="1">Fiction</option>
                  <option value="2">Mystery</option>
                  <option value="3">Romance</option>
                  <option value="4">Science Fiction</option>
                  <option value="5">Fantasy</option>
                  <option value="6">Historical Fiction</option>
                  <option value="7">Thriller</option>
                  <option value="8">Non-Fiction</option>
                  <option value="9">Biography</option>
                </select>
              ) : (
                <input
                  type={
                    field === "price" || field === "qty" ? "number" : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={classes.formInput}
                  required={required}
                />
              )}
            </div>
          ))}
          <div className={classes.buttonContainer}>
            <button
              type="button"
              className={classes.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className={classes.submitButton}>
              {book ? "Update Book" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookDialog;
