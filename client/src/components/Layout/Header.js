import React, { Fragment, useState, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import AdminButton from "./AdminButton.js";
import UserIcon from "./UserIcon.js";
import CartButton from "./CartButton.js";
import MainImage from "./MainImage.js";
import Login from "../Login/Login.js";
import logo from "../../assets/logo.png";
import classes from "./Header.module.css";

const Header = () => {
  // login dialog
  const [isLoginOpen, setLoginOpen] = useState(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  // Determine if we are on the home page
  const location = useLocation();
  const showMainImage = location.pathname === "/";

  // Get current user and admin status
  const { currentUser, isAdmin } = useContext(AuthContext);

  return (
    <Fragment>
      <header className={classes.header}>
        <Link to="/">
          <img src={logo} alt="logo" className={classes.logo} />
        </Link>
        <div className={classes["header-right"]}>
          {!isAdmin && <CartButton />}
          {isAdmin && <AdminButton />}
          <UserIcon onClick={openLogin} />
        </div>
      </header>

      {/* show MainImage if we are on the home page */}
      {showMainImage && <MainImage />}

      {/* Render Login dialog */}
      {isLoginOpen && <Login isOpen={isLoginOpen} onClose={closeLogin} />}
    </Fragment>
  );
};

export default Header;
