import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function MobileForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset email sent. Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Forgot Password</h2>
      <form onSubmit={handleReset} style={styles.form}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Send Reset Email
        </button>
        <p style={styles.note}>
          If the email you entered is registered, you’ll receive a reset link.
        </p>
        {message && <p style={{ ...styles.feedback, color: 'green' }}>{message}</p>}
        {error && <p style={{ ...styles.feedback, color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem 1rem',
    maxWidth: '400px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.9rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '0.9rem',
    fontSize: '1rem',
    backgroundColor: '#e50914',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  note: {
    fontSize: '0.85rem',
    color: '#666',
    textAlign: 'center',
    marginTop: '-0.5rem',
  },
  feedback: {
    textAlign: 'center',
    fontSize: '0.95rem',
    marginTop: '0.75rem',
  },
};

export default MobileForgotPassword;
