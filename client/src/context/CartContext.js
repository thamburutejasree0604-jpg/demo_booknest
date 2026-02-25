import React, {createContext, useState} from "react";

const CartContext = createContext({
  items: [],
  totalAmount: 0,
  addItem: (item) => {},
  removeItem: (id) => {},
  updateItem: (item, quantity) => {},
  clearCart: () => {},
});

export const CartProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id);
      console.log("Existing item index:", existingItemIndex);

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        return [...prevItems, item];
      }
    });
  };

  const removeItem = (_id) => {
    console.log("Removing item with id:", _id);
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== _id));
  };

  const updateItem = (item, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((i) => (i._id === item._id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        totalAmount,
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartContext;
