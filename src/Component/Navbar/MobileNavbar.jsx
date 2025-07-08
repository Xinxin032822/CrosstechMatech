import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../Data/firebase';
import './Navbar.css';

function MobileNavbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ ...currentUser, name: docSnap.data().name });
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar-mobile">
      <div className="mobile-top">
        <div className="nav-logo-mobile">Crosstech — Matech</div>
        <div className="menu-icon" onClick={() => setOpen(!open)}>&#9776;</div>
      </div>

      {open && (
        <>
          <ul className="mobile-links">
            <li><Link to="/" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setOpen(false)}>About</Link></li>
            <li><Link to="/products" onClick={() => setOpen(false)}>Products</Link></li>
            <li><Link to="/contact" onClick={() => setOpen(false)}>Contact</Link></li>
          </ul>

          <div className="mobile-auth-buttons">
            {user ? (
              <>
                <span className="nav-logged-user">Hi, {user.name}</span>
                <button onClick={handleLogout} className="auth-btn logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-btn login-btn">Login</Link>
                <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default MobileNavbar;
