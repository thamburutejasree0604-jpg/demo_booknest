import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./context/AuthContext.js";
import Header from "./components/Layout/Header.js";
import Books from "./components/Books/Books.js";
import BookDetail from "./components/BookDetail/BookDetail.js";
import SearchResults from "./components/SearchResults/SearchResults.js";
import Cart from "./components/Cart/Cart.js";
import { CartProvider } from "./context/CartContext.js";
import Inventory from "./components/Admin/Inventory.js";
import Error from "./components/Error/Error.js";
import NotFound from "./components/NotFound/NotFound.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import classes from "./App.module.css";

function App() {
  const { isAdmin, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner/loading indicator
  }

  console.log("Rendering routes. Admin status:", isAdmin);

  return (
    <CartProvider>
      <Router>
        <div className={classes.App}>
          <Header />
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/items/:slug" element={<BookDetail />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
            {/* Protect /inventory route with isAdmin check */}
            <Route
              path="/inventory"
              element={isAdmin ? <Inventory /> : <Navigate to="/" />}
            />
            <Route path="/error" element={<Error />} />
            <Route path="/404" element={<NotFound />} />
            {/* Catch all undefined routes with a custom 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <footer className={classes.footer}>
            <p>&copy; 2024 BookNest. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

