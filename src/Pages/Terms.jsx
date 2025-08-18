import React from 'react';
import '../Styles/Terms.css';

function Terms() {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>

      <p>Welcome to our platform. By accessing or using our services, you agree to comply with these Terms and Conditions. Please read carefully.</p>

      <h2>1. User Responsibilities</h2>
      <ul>
        <li>You agree to provide accurate, current, and complete information during registration and transactions.</li>
        <li>Account security is your responsibility; you must notify us immediately of any unauthorized use.</li>
        <li>You shall not use the platform for any illegal or unauthorized activities.</li>
      </ul>

      <h2>2. Orders and Payment</h2>
      <ul>
        <li>All orders are subject to availability and acceptance by us.</li>
        <li>Prices and shipping fees may vary and are subject to change without prior notice.</li>
        <li>Payment must be completed through the methods provided; we reserve the right to cancel unpaid orders.</li>
      </ul>

      <h2>3. Intellectual Property</h2>
      <p>All content on the platform, including text, graphics, logos, and images, is our property or licensed to us and protected by intellectual property laws.</p>

      <h2>4. Limitation of Liability</h2>
      <p>We are not liable for indirect, incidental, or consequential damages arising from the use or inability to use our platform.</p>

      <h2>5. Modifications</h2>
      <p>We may update these Terms at any time. Continued use after changes constitutes acceptance.</p>

      <h2>6. Contact Information</h2>
      <p>If you have questions about these Terms, please contact us at support@example.com.</p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Terms;
