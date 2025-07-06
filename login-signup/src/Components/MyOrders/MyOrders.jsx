import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

const ORDER_API_BASE_URL = "http://localhost:8083";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${ORDER_API_BASE_URL}/api/orders/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setMessage("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="orders-loading">Loading your orders...</div>;
  if (orders.length === 0)
    return <div className="orders-empty">You have not placed any orders yet.</div>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>
      {orders.map((order) => (
        <div className="order-card" key={order.id}>
          <div className="order-header">
            <span className="order-id">Order #{order.id}</span>
            <span className={`order-status status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
            <span className="order-date">
              {order.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
            </span>
          </div>
          <div className="order-items">
            {order.orderItems.map((item) => (
              <div className="order-item" key={item.id}>
                <span className="order-item-name">Product ID: {item.productId}</span>
                <span className="order-item-qty">Qty: {item.quantity}</span>
                <span className="order-item-price">
                  ₹{item.priceAtPurchase?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="order-total">
            Total: <b>₹{order.totalAmount?.toFixed(2)}</b>
          </div>
        </div>
      ))}
      {message && <div className="orders-message">{message}</div>}
    </div>
  );
};

export default Orders;
