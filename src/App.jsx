import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import './App.css'
import Home from './Pages/Home'
import Products from "../src/Pages/Products"
import Contacts from "../src/Pages/Contacts"
import About from "../src/Pages/About"
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Admin from './Pages/Admin';
import ProductDetail from './Pages/ProductDetail';
import ShippingDetail from './Pages/ShippingDetail';
import ProtectedAdminRoute from './Component/ProtectedAdminRoute/ProtectedAdminRoute';
import ShowNav from './Component/Navbar/showNav';
function App() {
const location = useLocation();
  return (
    <>
      <ShowNav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/shipping/:id" element={<ShippingDetail />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
