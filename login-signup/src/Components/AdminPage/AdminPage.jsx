import React, { useState, useEffect } from "react";
import axios from "axios";
import './AdminPage.css';

const API_BASE_URL = "http://localhost:8080";

const AdminDashboard = () => {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newUser, setNewUser] = useState({username: "", email: "", passwordHash: "", isAdmin: false});
  const [newProduct, setNewProduct] = useState({ name: "", price: "", description: "", stockQuantity: "" });
  const [editProduct, setEditProduct] = useState(null);
  // const [adminEmail, setAdminEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (tab === "users") fetchUsers();
    if (tab === "products") fetchProducts();
    if (tab === "orders") fetchOrders();
  }, [tab]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${API_BASE_URL}/api/admin/allUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage("Failed to fetch users");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      setMessage("Failed to fetch products");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`http://localhost:8083/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setMessage("Failed to fetch orders");
    }
  };

const handleMakeAdmin = async () => {
  try {
    const token = localStorage.getItem("jwtToken");
    // Convert isAdmin to roles array
    const userToSend = {
      ...newUser,
      roles: newUser.isAdmin ? ["ROLE_ADMIN"] : []
    };
    await axios.post(`${API_BASE_URL}/api/admin/create`, userToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage("Admin added!");
    setNewUser({ username: "", email: "", passwordHash: "", isAdmin: false });
    fetchUsers();
  } catch (err) {
    setMessage("Failed to add user");
  }
};

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(`${API_BASE_URL}/api/auth/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User added!");
      setNewUser({ username: "", email: "", password: ""});
      fetchUsers();
    } catch (err) {
      setMessage("Failed to add user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("User deleted!");
      fetchUsers();
    } catch (err) {
      setMessage("Failed to delete user");
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.post(`${API_BASE_URL}/api/products/create`, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product added!");
      setNewProduct({ name: "", price: "", description: "", stockQuantity: "" });
      fetchProducts();
    } catch (err) {
      setMessage("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product deleted!");
      fetchProducts();
    } catch (err) {
      setMessage("Failed to delete product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(`${API_BASE_URL}/api/products/${editProduct.id}`, editProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Product updated!");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      setMessage("Failed to update product");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("jwtToken");
      await axios.put(
        `http://localhost:8083/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Order status updated!");
      fetchOrders();
    } catch (err) {
      setMessage("Failed to update order status");
    }
  };

  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button onClick={() => setTab("users")}>Users</button>
        <button onClick={() => setTab("products")}>Products</button>
        <button onClick={() => setTab("orders")}>Orders</button>
        <button onClick={() => window.location.href = "/"}>Log Out</button>
        {/* <button onClick={() => setTab("admins")}>Make Admin</button> */}
      </div>
      {message && <div className={`admin-message ${message.includes("Failed") ? "error" : "success"}`}>{message}</div>}

      {tab === "users" && (
        <div>
          <h2 className="admin-section-title">Manage Users</h2>
          <div className="admin-form">
            <input type="text" placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
            <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
            <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
            <label>
                <input type="checkbox" checked={newUser.isAdmin} onChange={e => setNewUser({ ...newUser, isAdmin: e.target.checked })}/> Is Admin</label>
            <button onClick={newUser.isAdmin ? handleMakeAdmin : handleAddUser}> Add User</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Username</th><th>Email</th><th>Admin</th><th>Actions</th></tr>
            </thead>
            <tbody> 
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.roles && u.roles.includes("ROLE_ADMIN") ? "Yes" : "No"}</td>
                  <td><button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "products" && (
        <div>
          <h2 className="admin-section-title">Manage Products</h2>
          <div className="admin-form">
            <input type="text" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
            <input type="text" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
            <input type="number" placeholder="Stock" value={newProduct.stockQuantity} onChange={e => setNewProduct({ ...newProduct, stockQuantity: e.target.value })} />
            <button onClick={handleAddProduct}>Add Product</button>
          </div>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Price</th><th>Description</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{editProduct?.id === p.id ? <input type="text" value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} /> : p.name}</td>
                  <td>{editProduct?.id === p.id ? <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: e.target.value })} /> : p.price}</td>
                  <td>{editProduct?.id === p.id ? <input type="text" value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })} /> : p.description}</td>
                  <td>{editProduct?.id === p.id ? <input type="number" value={editProduct.stockQuantity} onChange={e => setEditProduct({ ...editProduct, stockQuantity: e.target.value })} /> : p.stockQuantity}</td>
                  <td>
                    {editProduct?.id === p.id ? (
                      <>
                        <button className="edit-btn" onClick={handleUpdateProduct}>Save</button>
                        <button onClick={() => setEditProduct(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => setEditProduct(p)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h2 className="admin-section-title">All Orders</h2>
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>User</th><th>Products</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.username}</td>
                  <td>{o.orderItems?.map(orderItems => (<div key={orderItems.id}>{orderItems.productId} (x{orderItems.quantity})</div>))}</td>
                  <td>{o.totalAmount}</td>
                  <td>
                      <select
                        value={o.status}
                        onChange={e => handleStatusChange(o.id, e.target.value)} >
                        <option value="PENDING">PENDING</option>
                        <option value="PLACED">PLACED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option> </select>  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;