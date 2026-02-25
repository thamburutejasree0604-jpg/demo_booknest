import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./UserIcon.module.css";

const UserIcon = ({ onClick }) => {
  const { currentUser } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully signed out");
      console.log("User signed out");
    } catch (error) {
      toast.error("Sign out failed", { className: "toastify-toast" });
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <button
      className={classes.button}
      onClick={currentUser ? handleSignOut : onClick}
    >
      <i className={`fas ${currentUser ? "fa-sign-out-alt" : "fa-user"}`}></i>
    </button>
  );
};

export default UserIcon;
