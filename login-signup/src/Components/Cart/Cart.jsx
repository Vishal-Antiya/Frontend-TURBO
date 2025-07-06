// Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
import productImg from '../Assets/product.jpg'; // fallback image
import "./Cart.css";

const ORDER_API_BASE_URL = "http://localhost:8083";
const PRODUCT_API_BASE_URL = "http://localhost:8080";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [productDetails, setProductDetails] = useState({}); // { [productId]: { name, description, ... } }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  // Fetch cart from Order Service
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${ORDER_API_BASE_URL}/api/orders/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
      // After cart is loaded, fetch product details for all items
      if (res.data && res.data.orderItems) {
        fetchAllProductDetails(res.data.orderItems);
      }
    } catch (err) {
      setMessage("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Fetch product details for all unique productIds in the cart
  const fetchAllProductDetails = async (orderItems) => {
    const idsToFetch = orderItems
      .map(item => item.productId)
      .filter(id => !(id in productDetails));
    // Remove duplicates
    const uniqueIds = [...new Set(idsToFetch)];
    // Fetch details for each productId not already in state
    await Promise.all(uniqueIds.map(fetchProductDetail));
  };

  // Fetch product detail for a single productId
  const fetchProductDetail = async (productId) => {
    try {
      const res = await axios.get(`${PRODUCT_API_BASE_URL}/api/products/${productId}`);
      setProductDetails(prev => ({
        ...prev,
        [productId]: res.data
      }));
    } catch (err) {
      // If product not found, set a placeholder
      setProductDetails(prev => ({
        ...prev,
        [productId]: { name: "Unknown Product", description: "N/A" }
      }));
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `${ORDER_API_BASE_URL}/api/orders/cart/update`,
        { productId, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      setMessage("Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(
        `${ORDER_API_BASE_URL}/api/orders/checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Checkout successful!");
      fetchCart();
    } catch (err) {
      setMessage("Checkout failed");
    }
  };

  if (loading) return <div className="cart-loading">Loading cart...</div>;
  if (!cart || !cart.orderItems || cart.orderItems.length === 0)
    return <div className="cart-empty">Your cart is empty.</div>;

  const stripePromise = loadStripe('pk_test_51Rhp7XRqe1W0mF16BiHWv8hfQ0IQIohe6e2idnCY0MLyMZTRUS3ugfxudjgIPoSrsfyLgbN1zb7rEnS6yRzlNMGs009tpp5coH'); 

const handleStripeCheckout = async () => {
  const token = localStorage.getItem("jwtToken");
  // Prepare items array from cart
  const items = cart.orderItems.map(item => ({
    name: productDetails[item.productId]?.name || "Product",
    amount: Math.round(item.priceAtPurchase * 100), // in paise
    quantity: item.quantity
  }));

const orderId = cart.id;

  const res = await fetch('http://localhost:8085/api/payments/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ items, orderId }) // <-- orderId included here
  });
  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  }
};

const handleCashOnDelivery = async () => {
  const token = localStorage.getItem("jwtToken");
  await fetch('http://localhost:8083/api/orders/checkout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  window.location.href = '/order-confirmation'; // Redirect to order confirmation page
};

const handleBackClick = () => {
    window.location.href = '/home';
  };

  return (
    <div className="cart-container">
        {/* Back Button */}
      <button className="back-button" onClick={handleBackClick}>
        🏠︎ Home
      </button>
      <div className="cart-box">
        {cart.orderItems.map((item) => {
          const details = productDetails[item.productId] || {};
          return (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-image">
                <img src={details.imageUrl || productImg} alt={details.name || "Product"} />
              </div>
              <div className="cart-item-details">
                <div className="cart-item-name">{details.name || "Loading..."}</div>
                <div className="cart-item-desc">{details.description || ""}</div>
                <div className="cart-item-price">
                  <b>₹{item.priceAtPurchase?.toFixed(2)}</b>
                </div>
              </div>
              <div className="cart-item-qty">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                >-</button>
                <span className="qty-number">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-footer">
    <div className="cart-total">
      Total: <b>₹{cart.totalAmount?.toFixed(2)}</b>
    </div>
    <button className="checkout-btn" onClick={handleStripeCheckout}>
      Pay with Card
    </button>
    <button className="checkout-btn" onClick={handleCashOnDelivery}>
      Cash on Delivery
    </button>
     </div>
      {message && <div className="cart-message">{message}</div>}
    </div>
  );
};

export default Cart;
