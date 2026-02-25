import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../../context/CartContext";
import classes from "./CartButton.module.css";

const CartButton = (props) => {
  const navigate = useNavigate();
  const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);
  const cartCtx = useContext(CartContext);

  const { items } = cartCtx;
  const numberOfCartItems = items.reduce(
    (curNumber, item) => curNumber + item.quantity,
    0
  );
  const btnClasses = `${classes.button} ${
    btnIsHighlighted ? classes.bump : ""
  }`;

  useEffect(() => {
    if (items.length === 0) return;
    setBtnIsHighlighted(true);
    const timer = setTimeout(() => setBtnIsHighlighted(false), 300);
    return () => clearTimeout(timer);
  }, [items]);

  const handleClick = () => {
    navigate("/cart");
  };

  return (
    <div className={classes.cartIconWrapper}>
      <div className={btnClasses} onClick={handleClick}>
        <i className="fas fa-shopping-cart"></i>
      </div>
      {numberOfCartItems > 0 && (
        <span
          className={`${classes.cartBadge} ${btnIsHighlighted ? "bump" : ""}`}
        >
          {numberOfCartItems}
        </span>
      )}
    </div>
  );
};

export default CartButton;
