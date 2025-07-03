import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from './Pages/Home'
import Navbar from "../src/Component/Navbar/Navbar"
import Products from "../src/Pages/Products"
import Contacts from "../src/Pages/Contacts"
import About from "../src/Pages/About"
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Admin from './Pages/Admin';
import ProductDetail from './Pages/ProductDetail';
import ShippingDetail from './Pages/ShippingDetail';
function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/products/:id" element={<ProductDetail/>} />
        <Route path="/shipping/:id" element={<ShippingDetail/>} />

      </Routes>
    </Router>
  )
}

export default App
