import React, { useState } from "react";
import axios from "axios";
import './LoginSignup.css';
import user_icon from '../Assets/user-icon.png';
import email_icon from '../Assets/email-icon.png';
import pass_icon from '../Assets/pass-icon.png';

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("user"); // Default to 'user'
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:8080";

  // Updated login handler to use different URL based on role
  const handleLogin = async () => {
    setMessage("");
    setError("");
    try {
      // Decide endpoint based on role
      let loginUrl;
      if (role === "user") {
        loginUrl = `${API_BASE_URL}/api/auth/login`;
      } else if (role === "admin") {
        loginUrl = `${API_BASE_URL}/api/admin/auth/login`;
      }

      const response = await axios.post(loginUrl, {
        username: username,
        password: password,
      });

      const { token } = response.data;
      localStorage.setItem("jwtToken", token);
      setMessage("Login successful! Redirecting...");
        if (role === "admin") {
            window.location.href = "/admin-page";
            } else {
            window.location.href = "/home";
            }
    } catch (err) {
      console.error("Login error:", err.response.data);
      if (err.response) {
        setError(err.response.data || "Invalid username or password.");
      } else if (err.request) {
        setError("No response from server. Please check your backend connection.");
      } else {
        setError("An unexpected error occurred during login.");
      }
    }
  };

  const handleSignUp = async () => {
    setMessage("");
    setError("");
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username: username,
        email: email,
        passwordHash: password,
        firstName: firstName,
        lastName: lastName,
      });
      setMessage(response.data || "Registration successful! Please log in.");
      setAction("Login");
    } catch (err) {
      console.error("Sign Up error:", err);
      if (err.response) {
        setError(err.response.data || "Registration failed. Username or email might be taken.");
      } else if (err.request) {
        setError("No response from server. Please check your backend connection.");
      } else {
        setError("An unexpected error occurred during registration.");
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (action === "Login") {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="login-signup-container">
      <div className="container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>
        <div className="submit-container">
          <button
            className={action === "Login" ? "submit" : "submit gray"}
            onClick={() => setAction("Login")}
          >
            Login
          </button>
          <button
            className={action === "Sign Up" ? "submit" : "submit gray"}
            onClick={() => setAction("Sign Up")}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <img src={user_icon} alt="" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {action === "Sign Up" && (
              <>
                <div className="input">
                  <img src={email_icon} alt="" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={user_icon} alt="" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input">
                  <img src={user_icon} alt="" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="input">
              <img src={pass_icon} alt="" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* DROPDOWN for LOGIN only */}
            {action === "Login" && (
              <div className="input">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "16px"
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}
          </div>
          <div className="forgot-pass">
            {action === "Login" && <span>Forgot Password?</span>}
          </div>
          {message && <div className="message success">{message}</div>}
          {error && <div className="message error">{error}</div>}
          <div className="submit-container">
            <button type="submit" className="submit">
              {action}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;
