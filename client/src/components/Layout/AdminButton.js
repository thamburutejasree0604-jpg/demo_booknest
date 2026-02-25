import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import classes from "./AdminButton.module.css";

const AdminButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/inventory");
  };

  return (
    <button className={classes.button} onClick={handleClick}>
      <i className="fas fa-archive"></i> 
    </button>
  );
};

export default AdminButton;
