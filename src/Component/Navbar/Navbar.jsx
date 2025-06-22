import React from 'react'
import { Link } from "react-router-dom";
import "../Navbar/Navbar.css"
function Navbar() {
  return (
    <div className='NavbarMainLoggedOut'>

      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutFirstChild">
        <p>Crosstech — Matech</p>
      </div>
      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutSecondChild">

        <ul className="NavigationCrosstechMatech">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

      </div>
      <div className="NavbarItemsLoggedOut NavbarItemsLoggedOutThirdChild">
        <Link to="/login" className="nav-btn login-btn">Login</Link>
        <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
      </div>



    </div>
  )
}

export default Navbar