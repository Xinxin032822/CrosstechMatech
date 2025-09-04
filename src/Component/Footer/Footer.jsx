import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3>CrosstechMatech</h3>
          <p>Your trusted partner for heavy equipment solutions in the Philippines.</p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/services">Services</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact Info</h4>
          <p>📍 Davao City, Philippines</p>
          <p>📞 +63 925 777 4587</p>
          <p>✉️ dcantuba_08@yahoo.com</p>
        </div>
      </div>
      <hr className="footer-divider" />
      <p className="footer-bottom">© 2025 Matech. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
