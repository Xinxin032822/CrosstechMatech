import React from 'react';
import '../Styles/Terms.css';

function Terms() {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>

      <p>
        By registering and using this platform, users agree to act responsibly and ethically. This includes:
      </p>

      <ul>
        <li>Providing accurate and up-to-date information during account creation and order processing.</li>
        <li>Refraining from fraudulent, abusive, or manipulative behavior while using the platform.</li>
        <li>Complying with applicable laws and regulations while using our services.</li>
      </ul>

      <p>
        The platform reserves the right to suspend or terminate user accounts that violate these terms without prior notice.
      </p>

      <p>
        All purchases made through this platform are subject to product availability and the accuracy of the information provided by the user.
        We are not liable for failed transactions due to false information or misuse of the platform.
      </p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Terms;
