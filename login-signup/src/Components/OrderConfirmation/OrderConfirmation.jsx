// OrderConfirmation.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleBackToShopping = () => {
    navigate("/home");
  };

  return (
    <div className="confirmation-container">
      <div className="confirmation-box">
        <div className="confirmation-tick">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="38" fill="#e6f9ec" stroke="#34c759" strokeWidth="4"/>
            <polyline points="25,43 37,55 57,30" fill="none" stroke="#34c759" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="confirmation-message">
          <h2>Your order has been placed!</h2>
        </div>
        <button className="back-shopping-btn" onClick={handleBackToShopping}>
          Back to Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
