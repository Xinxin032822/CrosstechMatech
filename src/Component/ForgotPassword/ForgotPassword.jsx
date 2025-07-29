import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
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
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>Forgot Password</h2>
          <p style={styles.subtitle}>
            If the email you entered is registered, you’ll receive a reset link shortly.
          </p>
          <form onSubmit={handleReset} style={styles.form}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>
              Send Reset Email
            </button>
          </form>
          {message && <p style={{ ...styles.message, color: 'green' }}>{message}</p>}
          {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    padding: '1rem',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  card: {
    background: '#fff',
    padding: '3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
  margin: 0,
    fontSize: '2.5rem',
    textAlign: 'center',
    color: '#222',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
  },
  input: {
    padding: '1.2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontSize: '1.1rem',
  },
  button: {
    padding: '1.2rem',
    background: '#e50914',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
    wordBreak: 'break-word',
    fontSize: '0.95rem',
    minHeight: '1rem',
  },
};

export default ForgotPassword;



