import React from 'react';
import '../Styles/Privacy.css';

function Privacy() {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>

      <p>Your privacy is important to us. This policy explains what information we collect, how we use it, and your rights.</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li><strong>Personal Information:</strong> Name, email, phone, shipping address, payment details collected during registration and purchases.</li>
        <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, and interaction data.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill your orders.</li>
        <li>To communicate important updates and customer support.</li>
        <li>To improve our services and website performance.</li>
      </ul>

      <h2>3. Information Sharing and Disclosure</h2>
      <p>We do not sell your personal information. We may share information with trusted third parties only to provide services (e.g., payment processors, shipping companies) and comply with legal obligations.</p>

      <h2>4. Data Security</h2>
      <p>We use industry-standard security measures to protect your data from unauthorized access and breaches.</p>

      <h2>5. Your Rights</h2>
      <ul>
        <li>You can request access, correction, or deletion of your personal data.</li>
        <li>You may opt out of marketing communications.</li>
        <li>Contact us at privacy@example.com to exercise these rights.</li>
      </ul>

      <h2>6. Cookies and Tracking Technologies</h2>
      <p>We use cookies to enhance your browsing experience. You can control cookie settings through your browser.</p>

      <h2>7. Policy Updates</h2>
      <p>We may update this policy periodically. Changes will be posted on this page with the date of revision.</p>

      <h2>8. Contact Information</h2>
      <p>If you have questions about this Privacy Policy, please contact us at privacy@example.com.</p>

      <p className="last-updated">Last updated: August 3, 2025</p>
    </div>
  );
}

export default Privacy;
