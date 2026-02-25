import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./DeleteDialog.module.css";

const DeleteDialog = ({ onClose, onDelete, bookId }) => {
  const handleConfirmDelete = async () => {
    try {
      await onDelete(bookId);
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete the book. Please try again.");
    }
    onClose(); // Close the dialog after the operation
  };

  return (
    <div className={classes.dialog}>
      <span className={classes.closeButton} onClick={onClose}>
        &times;
      </span>
      <div className={classes.dialogContent}>
        <p>
          <strong>
            Are you sure you want to delete this book? <br/> 
            This cannot be undone.
          </strong>
        </p>
        <div className={classes.buttonContainer}>
          <button className={classes.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={classes.confirmButton}
            onClick={handleConfirmDelete}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
