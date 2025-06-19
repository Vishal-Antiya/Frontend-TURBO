import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Products.css';
import user_icon from '../Assets/user-icon.png';
import logo from '../Assets/logo.png';
import product from '../Assets/product.jpg';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cartLoading, setCartLoading] = useState({});

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:8080/api/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add product to cart
    const addToCart = async (productId) => {
        try {
            setCartLoading(prev => ({ ...prev, [productId]: true }));

            const token = localStorage.getItem('authToken');
            
            if (!token) {
                alert('Please login to add items to cart');
                return;
            }

            const response = await fetch('http://localhost:8080/api/orders/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: 1
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert('Product added to cart successfully!');
            console.log('Cart updated:', result);

        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('Failed to add product to cart. Please try again.');
        } finally {
            setCartLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <div className="product-list-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="menu">
                    <Link to="/home">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/about-us">About Us</Link>
                    <Link to="/cart">Cart</Link>
                    <div className="dropdown">
                        <img src={user_icon} alt="User" className="dropbtn" />
                        <div className="dropdown-content">
                            <Link to="/profile">Profile</Link>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/about-us">Contact</Link>
                            <Link to="/manage-account">Settings</Link>
                            <Link to="/">Logout</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <div className="page-header">
                <h1>All Products</h1>
                <p>Browse our complete collection of products</p>
            </div>

            {/* Product List */}
            <div className="product-list">
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading products...</p>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={fetchProducts}>Retry</button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <div className="no-products">
                        <p>No products available at the moment.</p>
                        <button onClick={fetchProducts}>Refresh</button>
                    </div>
                )}

                {!loading && !error && products.map((productItem, index) => (
                    <div key={productItem.id} className="product-list-item">
                        <div className="product-number">
                            {index + 1}
                        </div>
                        <div className="product-image">
                            <img src={product} alt={productItem.name || 'Product'} />
                        </div>
                        <div className="product-details">
                            <h2 className="product-title">
                                {productItem.name || 'Unnamed Product'}
                            </h2>
                            <p className="product-description">
                                {productItem.description || 'No description available'}
                            </p>
                            <div className="product-meta">
                                <span className="product-price">
                                    ${productItem.price ? productItem.price.toFixed(2) : 'N/A'}
                                </span>
                                <span className="product-stock">
                                    Stock: {productItem.stockQuantity || 0} units
                                </span>
                            </div>
                        </div>
                        <div className="product-actions">
                            <button 
                                onClick={() => addToCart(productItem.id)}
                                disabled={cartLoading[productItem.id] || productItem.stockQuantity === 0}
                                className={`add-to-cart-btn ${productItem.stockQuantity === 0 ? 'out-of-stock' : ''}`}
                            >
                                {cartLoading[productItem.id] 
                                    ? 'Adding...' 
                                    : productItem.stockQuantity === 0 
                                        ? 'Out of Stock' 
                                        : 'Add to Cart'
                                }
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductListPage;
