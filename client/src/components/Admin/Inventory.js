import React, { useState } from "react";
import BooksTab from "./BooksTab.js";
import OrdersTab from "./OrdersTab.js";
import classes from "./Inventory.module.css";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("books");

  return (
    <div className={classes.inventoryContainer}>

      <div className={classes.tabs}>
        <button
          className={`${classes.tab} ${
            activeTab === "books" ? classes.active : ""
          }`}
          onClick={() => setActiveTab("books")}
        >
          Books
        </button>
        <button
          className={`${classes.tab} ${
            activeTab === "orders" ? classes.active : ""
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {activeTab === "books" && <BooksTab />}
      {activeTab === "orders" && <OrdersTab />}
    </div>
  );
};

export default Inventory;
