import React, { useState } from "react";
import axios from "axios"; // Import axios for HTTP requests
import './LoginSignup.css';
import user_icon from '../Assets/user-icon.png'; // Make sure these paths are correct
import email_icon from '../Assets/email-icon.png';
import pass_icon from '../Assets/pass-icon.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Sign Up");

    // State for form inputs
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Assuming backend also accepts first name and last name for registration
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // State for messages (success/error)
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Base URL for your API Gateway
    const API_BASE_URL = "http://localhost:8080"; // Adjust if your API Gateway is on a different port/host

    const handleLogin = async () => {
        setMessage(""); // Clear previous messages
        setError("");   // Clear previous errors
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
                username: username,
                password: password,
            });

            const { token } = response.data;
            localStorage.setItem("jwtToken", token); // Store the token
            setMessage("Login successful! Redirecting...");
            console.log("Login successful! Token:", token);
            // TODO: Redirect to dashboard or home page after successful login
            window.location.href = "/home"; // Example redirect
        } catch (err) {
            console.error("Login error:", err);
            if (err.response) {
                // Server responded with a status other than 2xx
                setError(err.response.data || "Invalid username or password.");
            } else if (err.request) {
                // Request was made but no response received
                setError("No response from server. Please check your backend connection.");
            } else {
                // Something else happened
                setError("An unexpected error occurred during login.");
            }
        }
    };

    const handleSignUp = async () => {
        setMessage(""); // Clear previous messages
        setError("");   // Clear previous errors
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
                username: username,
                email: email,
                passwordHash: password, // Important: backend expects 'passwordHash'
                firstName: firstName,
                lastName: lastName,
            });

            setMessage(response.data || "Registration successful! Please log in.");
            console.log("Sign Up successful:", response.data);
            // Optionally, switch to login view after successful signup
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
        event.preventDefault(); // Prevent default form submission behavior (page reload)
        if (action === "Login") {
            handleLogin();
        } else {
            handleSignUp();
        }
    };

    return(
        <div className="login-signup-container">
        <div className="container">
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>

            {/* Wrap inputs and submit buttons in a form element */}
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    {action === "Sign Up" && (
                        <>
                            <div className="input">
                                <img src={user_icon} alt="User Icon" />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input">
                                <img src={user_icon} alt="First Name Icon" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div className="input">
                                <img src={user_icon} alt="Last Name Icon" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Username/Email for Login and Email for Signup */}
                    {action === "Login" ? (
                         <div className="input">
                            <img src={user_icon} alt="User Icon" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    ) : (
                        <div className="input">
                            <img src={email_icon} alt="Email Icon" />
                            <input
                                type="email"
                                placeholder="E-mail Id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}


                    <div className="input">
                        <img src={pass_icon} alt="Password Icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Display messages */}
                {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                {action === "Login" ? (
                    <div className="forgot-pass">Lost Password? <span>Click Here</span></div>
                ) : (
                    <div/>
                )}

                <div className="submit-container">
                    {/* Make these buttons submit the form */}
                    <button
                        type="submit"
                        className={action === "Login" ? "submit gray" : "submit"}
                        onClick={() => setAction("Sign Up")} // This will change action and trigger re-render, then submit
                    >
                        Sign Up
                    </button>
                    <button
                        type="submit"
                        className={action === "Sign Up" ? "submit gray" : "submit"}
                        onClick={() => setAction("Login")} // This will change action and trigger re-render, then submit
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
        </div>
    );
};

export default LoginSignup;
