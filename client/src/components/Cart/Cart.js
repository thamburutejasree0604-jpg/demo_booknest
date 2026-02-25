import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import CartContext from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Cart.module.css";

const Cart = () => {
  const { items, removeItem, updateItem, totalAmount, clearCart } =
    useContext(CartContext);
  const { currentUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Check the authentication state when the component is rendered
  // set default email value accordingly
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || "");
    } else {
      setEmail("");
    }
  }, [currentUser]);

  const fetchBookById = async (_id) => {
    try {
      const response = await fetch(`http://localhost:8000/items?id=${_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch book");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const validateQuantities = async () => {
    try {
      for (const item of items) {
        const book = await fetchBookById(item._id);
        if (item.quantity > book.qty) {
          return `Quantity for "${book.title}" exceeds available stock.`;
        }
      }
      return null; // No validation errors
    } catch (error) {
      console.error(error);
      return "Error checking book quantities.";
    }
  };

  const submitOrder = async (event) => {
    event.preventDefault();

    // Check if email is provided
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    // Check if order qty exceeds current stock level
    const validationError = await validateQuantities();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        _id: item._id,
        quantity: item.quantity,
      })),
      email,
      totalAmount,
      orderTime: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:8000/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order submitted successfully!");
        clearCart();
        setTimeout(() => {
          navigate("/"); // Redirect to homepage after 2 seconds
        }, 2000);
      } else {
        const errorDetails = await response.json();
        console.log(errorDetails.message);
        throw new Error(errorDetails.message || "Failed to submit order.");
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <form className={classes.cart}>
      <h2>My Cart</h2>
      {items.map((item) => (
        <CartItem
          key={item._id}
          item={item}
          removeFromCart={removeItem}
          updateCartItem={updateItem}
        />
      ))}
      <h3>Total : ${totalAmount.toFixed(2)}</h3>
      <div className={classes["email-field"]}>
        <label htmlFor="email">Your contact email: </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="button"
        className={classes["submit-button"]}
        onClick={submitOrder}
      >
        Confirm Order
      </button>
    </form>
  );
};

export default Cart;
