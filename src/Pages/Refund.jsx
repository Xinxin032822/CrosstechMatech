import React from 'react';
import '../Styles/Refund.css';

function Refund() {
  return (
    <div className="refund-container">
      <h1>Refund Policy</h1>

      <p>We want you to be satisfied with your purchase. Please review our refund policy carefully.</p>

      <h2>1. Refund Eligibility</h2>
      <ul>
        <li>Refund requests must be submitted within 7 calendar days of receipt of the product.</li>
        <li>Products must be returned in their original condition and packaging.</li>
        <li>Customized or perishable items are non-refundable unless defective.</li>
      </ul>

      <h2>2. Refund Process</h2>
      <p>To request a refund, please contact our support team at support@example.com with your order number and reason for refund.</p>

      <h2>3. Processing Time</h2>
      <p>Once approved, refunds will be processed to the original payment method within 7–10 business days.</p>

      <h2>4. Exceptions and Non-Refundable Items</h2>
      <ul>
        <li>Services that have been started or completed are not eligible for refunds.</li>
        <li>Shipping fees are non-refundable.</li>
      </ul>

      <h2>5. Contact Us</h2>
      <p>For any refund inquiries, email us at support@example.com or call (123) 456-7890.</p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Refund;
