import React, { useState, useEffect, useContext } from "react";
import useAuthFetch from "../../utils/useAuthFetch.js";
import classes from "./Inventory.module.css";
import "react-toastify/dist/ReactToastify.css";

const OrdersTab = () => {
  const [orders, setOrders] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const { requestWithAuth } = useAuthFetch();

  const fetchOrders = async (email = "") => {
    try {
      let url = "http://localhost:8000/orders";
      const params = [];
      if (email) params.push(`email=${encodeURIComponent(email)}`);
      if (params.length) url += `?${params.join("&")}`;

      const response = await requestWithAuth(url, "GET");
      console.log(response);

      if (response.message === "Orders not found.") {
        setOrders([]);
      } else {
        setOrders(response);
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    fetchOrders(searchEmail);
  };

  return (
    <div className={classes.orderListWrapper}>
      <div className={classes.searchContainer}>
        <input
          type="text"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Search by email"
          className={classes.searchInput}
        />
        <button onClick={handleSearch} className={classes.searchButton}>
          Search
        </button>
      </div>
      <table className={classes.orderTable}>
        <thead>
          <tr>
            <th>Order Date</th>
            <th>Email</th>
            <th>Details</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4">No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{new Date(order.orderTime).toLocaleDateString()}</td>
                <td>{order.email}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item._id} className={classes.orderDetail}>
                      <p>
                        <strong>{item.title}</strong>
                      </p>
                      <p className={classes.orderDetailText}>
                        <span>Unit Price: ${item.price.toFixed(2)}</span>
                        <span>Qty: {item.quantity}</span>
                      </p>
                    </div>
                  ))}
                </td>
                <td className={classes.totalAmount}>
                  ${order.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTab;
