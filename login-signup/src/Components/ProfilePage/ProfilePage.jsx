import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // You'll need to install this library
import './ProfilePage.css'; // CSS file

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // 1. Get the token from localStorage
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    setError("No token found. Please log in.");
                    // Optional: redirect to login page
                    // window.location.href = "/";
                    return;
                }

                // 2. Decode the token to get the username
                const decodedToken = jwtDecode(token);
                const username = decodedToken.sub; // 'sub' is the standard claim for subject (username)
                
                console.log("Decoded Token:", decodedToken);
                console.log("Username from token:", username);

                // 3. Make an authenticated API call
                const API_BASE_URL = "http://localhost:8080";

                console.log("Making API call to:", `${API_BASE_URL}/api/users/username/${username}`);

                const response = await axios.get(`${API_BASE_URL}/api/users/username/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                 console.log("Made API call");

                // 4. Set the user data in state
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
                setError("Failed to fetch user data. Your session might have expired.");
            }
        };

        fetchUserData();
    }, []); // The empty array ensures this effect runs only once on component mount

    if (error) {
        return <div className="profile-container error">{error}</div>;
    }

    if (!user) {
        return <div className="profile-container">Loading profile...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h1>User Profile</h1>
                <div className="profile-info">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;