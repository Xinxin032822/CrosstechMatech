import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../Data/firebase';
import { FaCog } from 'react-icons/fa'; 
import "../Navbar/Navbar.css";

function Navbar() {
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

  return (
    <div className='NavbarMainLoggedOut'>
      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutFirstChild">
        <p>Crosstech — Matech</p>
      </div>

      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutSecondChild">
        <ul className="NavigationCrosstechMatech">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </div>

      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutThirdChild">
        {user ? (
          <>
            <span className="nav-logged-user">Hi, {user.name || user.displayName || "User"}</span>
            <Link to="/user" className="nav-btn settings-btn"><FaCog /> </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-btn loginbtnNouser">Login</Link>
            <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
