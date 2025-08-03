import React from 'react';
import '../Styles/Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>

      <p>
        We are committed to protecting your privacy. This policy outlines how we collect, use, and safeguard your information.
      </p>

      <ul>
        <li>
          <strong>Information Collection:</strong> We collect personal data only when necessary for registration, communication, and transaction purposes.
        </li>
        <li>
          <strong>Data Usage:</strong> Your data is used solely to provide services, process transactions, and communicate updates.
        </li>
        <li>
          <strong>Security:</strong> We implement standard security practices to protect your information from unauthorized access, misuse, or disclosure.
        </li>
      </ul>

      <p>
        We do not sell or share your personal data with third parties without your explicit consent, except as required by law.
      </p>

      <p>
        By using this platform, you consent to the collection and use of your information as described in this policy.
      </p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Privacy;
