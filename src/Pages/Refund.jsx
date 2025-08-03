import React from 'react';
import '../Styles/Refund.css';

function Refund() {
  return (
    <div className="refund-container">
      <h1>Refund Policy</h1>

      <p>
        Our refund policy is designed to be fair and transparent. Please read carefully before making a purchase.
      </p>

      <ul>
        <li>
          <strong>Eligibility:</strong> Refund requests must be made within 7 days of purchase.
        </li>
        <li>
          <strong>Non-Refundable:</strong> Services that have already been fulfilled or started are non-refundable.
        </li>
        <li>
          <strong>Process:</strong> To request a refund, please contact our support team with your order details.
        </li>
      </ul>

      <p>
        Once your request is reviewed, you will receive a confirmation email. Approved refunds may take up to 7 business days to appear in your account.
      </p>

      <p>
        We reserve the right to decline refund requests that do not meet the above criteria.
      </p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Refund;
