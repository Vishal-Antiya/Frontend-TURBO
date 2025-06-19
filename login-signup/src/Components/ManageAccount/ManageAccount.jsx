// src/components/ManageAccountPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './ManageAccount.css'; // Create this CSS file for styling

const ManageAccountPage = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        passwordHash: '' // This will be used for changing password
    });
    const [originalUsername, setOriginalUsername] = useState(''); // To hold the username from token
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const API_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub;
                setOriginalUsername(username); // Store the username from the token

                const response = await axios.get(`${API_BASE_URL}/api/users/username/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data); // Populate form with current user data
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("Failed to fetch user data. Your session might have expired.");
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const token = localStorage.getItem("jwtToken");
            if (!token) {
                setError("No token found. Please log in.");
                return;
            }

            // Prepare data for update. Only include fields that are potentially changed.
            const dataToUpdate = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            };

            // Only include passwordHash if it's provided (user intends to change it)
            if (user.passwordHash) {
                dataToUpdate.passwordHash = user.passwordHash;
            }

            const response = await axios.put(`${API_BASE_URL}/api/users/username/${originalUsername}`, dataToUpdate, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setUser(response.data); // Update local state with the latest data from the server
            setMessage("Profile updated successfully!");
            // Clear password field after successful update
            setUser(prevUser => ({ ...prevUser, passwordHash: '' }));

        } catch (err) {
            console.error("Failed to update user data:", err);
            if (err.response && err.response.data) {
                setError(`Failed to update profile: ${err.response.data.message || err.response.statusText}`);
            } else {
                setError("Failed to update profile. Please try again.");
            }
        }
    };

    if (error && !user.username) { // Only show full error if user data couldn't be loaded initially
        return <div className="manage-account-container error">{error}</div>;
    }

    if (!user.username && !error) { // Loading state
        return <div className="manage-account-container">Loading account details...</div>;
    }

    return (
        <div className="manage-account-container">
            <div className="manage-account-card">
                <h1>Manage Account</h1>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit} className="manage-account-form">
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            readOnly // Username typically shouldn't be changeable through this form
                            className="read-only-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={user.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={user.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordHash">New Password (leave blank to keep current):</label>
                        <input
                            type="password"
                            id="passwordHash"
                            name="passwordHash"
                            // value={user.passwordHash}
                            onChange={handleChange}
                            placeholder="Enter new password"
                        />
                    </div>
                    <button type="submit" className="update-button">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ManageAccountPage;