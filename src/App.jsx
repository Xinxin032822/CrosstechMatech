import { useState, useEffect } from 'react'
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
import ShowNav from './Component/Navbar/ShowNav';
import ProductDetailMobile from './Pages/ProductDetailMobile';
import AdminMobile from './Pages/AdminMobile';
import ContactMobile from './Pages/ContactMobile';
import MobileLogin from './Pages/MobileLogin';
import MobileSignup from './Pages/MobileSignup';
function App() {
const location = useLocation();
const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <ShowNav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/contact" element={
            isMobile? <ContactMobile/> :<Contacts />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={isMobile? <MobileLogin />: <Login/>} />
          <Route path="/signup" element={isMobile? <MobileSignup/> : <Signup/>} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                {
                  isMobile? <AdminMobile/> :<Admin/>
                }
              </ProtectedAdminRoute>
            }
          />
          <Route path="/products/:id" element={isMobile ? <ProductDetailMobile /> : <ProductDetail />} />
          <Route path="/shipping/:id" element={<ShippingDetail />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default App
