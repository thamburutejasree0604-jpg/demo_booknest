import React from "react";
import classes from "./Cart.module.css";

const CartItem = ({ item, removeFromCart, updateCartItem }) => {
  const handleQuantityChange = (e) => {
    updateCartItem(item, parseInt(e.target.value));
  };

  return (
    <div className={classes['cart-item']}>
      <img src={item.cover} alt={item.title} className={classes['cart-item-image']} />
      <h4>{item.title}</h4>
      <p>@ ${item.price.toFixed(2)}</p>
      <input
        type="number"
        value={item.quantity}
        onChange={handleQuantityChange}
        min="1"
      />
      <button onClick={() => removeFromCart(item._id)}>Remove</button>
    </div>
  );
};

export default CartItem;
