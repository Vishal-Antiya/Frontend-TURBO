import React from 'react';
import './AboutUs.css'; // Create this CSS file for styling
import logo from '../Assets/logo.png'

const AboutUsPage = () => {
    return (
        <div className="about-us-container">
            <div className="about-us-card">
                <img src={logo} alt="Turbo Logo" className="about-us-logo" />
                <h1>About Turbo</h1>
                <p>
                    Welcome to **Turbo**, your premier destination for high-quality products and seamless shopping experiences.
                    Founded with a vision to revolutionize the e-commerce landscape, Turbo is committed to
                    providing an unparalleled selection of goods coupled with exceptional customer service.
                </p>
                <p>
                    At Turbo, we believe in innovation, reliability, and customer satisfaction. Our platform
                    is designed to be intuitive and user-friendly, ensuring that you can find exactly what you need
                    with ease. We work tirelessly to curate a diverse range of products, from everyday essentials
                    to unique finds, all at competitive prices.
                </p>
                <p>
                    Our mission extends beyond just selling products; we aim to build a community where quality
                    meets convenience. We are constantly evolving and adapting to meet the dynamic needs of our customers,
                    always striving to exceed expectations.
                </p>
                <p>
                    Thank you for choosing Turbo. We are excited to have you on board and look forward to serving you!
                </p>
                <div className="contact-info">
                    <h2>Get in Touch</h2>
                    <p>Email: info@turbo.com</p>
                    <p>Phone: +1 (555) 123-4567</p>
                    <p>Address: 123 Turbo Lane, Innovation City, TC 98765</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;