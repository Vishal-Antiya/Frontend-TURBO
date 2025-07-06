// Cart.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
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

  return (
    <div className="cart-container">
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
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
      {message && <div className="cart-message">{message}</div>}
    </div>
  );
};

export default Cart;
