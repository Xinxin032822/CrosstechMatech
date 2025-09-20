import React from 'react';
import "../Styles/Home.css";
import ProductCard from '../Component/ProductCard/ProductCard';
import { Link, useNavigate } from 'react-router-dom';

import { easeInOut, motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";


import { collection, getDocs } from "firebase/firestore";
import { db } from "../Data/firebase.js";
import { useEffect, useState } from "react";
import Footer from '../Component/Footer/Footer.jsx';


function Home() {
  useEffect(() => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = 'url("/background.png") no-repeat center bottom';
    overlay.style.backgroundSize = "cover";
    overlay.style.backgroundAttachment = "scroll";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.zIndex = "-1";
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = "0.4";
    });

    return () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    };
  }, []);
  const titleVariant = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const subheaderVariant = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.8,
        delay: 0.2,
        ease: 'easeOut',
      },
    },
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const buttonVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration:1, easeInOut } },
  };

  const featureItemVariants = {
    initial: { opacity: 0, x: -100 },
    animate: (i) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: i * 0.2 },
    }),
  };


  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsArray);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
}, []);


  return (
    <div className='HomePage-container'>
      
      <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    className="hero-container">
      <motion.div className='MainHeaderHeroSection' variants={sectionVariants}>
        <img src="/assets/hp1.jpg" alt="Homepage" className="hero-image" />
        <div className="hero-content">
          <motion.h1 
            variants={titleVariant} 
            className='HeroHeaderTitle'
            initial="hidden"
            animate="visible"
          >Built for Progress.<br />Delivered Nationwide.</motion.h1>
          <motion.p 
            variants={subheaderVariant}
            initial="hidden"
            animate="visible"
          >Premium heavy equipment solutions for construction professionals across the Philippines</motion.p>
          <motion.div className="hero-buttons" variants={buttonVariants}>
            <button className="browse-btn" onClick={() => navigate('/products')}>
              View Products
            </button>
            <button className="quote-btn" onClick={() => navigate('/contact')}>
              Inquire
            </button>
          </motion.div>
        </div>
      </motion.div>
      <motion.div className="why-choose" variants={sectionVariants}>
        <motion.h2
          initial={{ opacity: 0, y:-50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }} className='WhyChooseUsHeaderHomePage'>Why Choose Matech</motion.h2>
        <motion.p
          initial={{ opacity: 0, y:-50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}>Your trusted partner in heavy equipment solutions</motion.p>
        <motion.div 
          className="features">
          <motion.div 
          className="feature-item"
          initial={{ opacity: 0, y:50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}>
            <div className="icon-circle">
              <svg className="svg-inline--fa fa-shield-halved small-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="shield-halved" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="#E50914" d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8V444.8C394 378 431.1 230.1 432 141.4L256 66.8l0 0z"></path></svg>
            </div>
            <h3>Trusted Quality</h3>
            <p>Premium equipment from leading manufacturers, rigorously tested for performance and reliability</p>
          </motion.div>
          <motion.div 
          className="feature-item"
          initial={{ opacity: 0, y:50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}>
            <div className="icon-circle">
              <svg className="svg-inline--fa fa-screwdriver-wrench small-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="screwdriver-wrench" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="#E50914" d="M78.6 5C69.1-2.4 55.6-1.5 47 7L7 47c-8.5 8.5-9.4 22-2.1 31.6l80 104c4.5 5.9 11.6 9.4 19 9.4h54.1l109 109c-14.7 29-10 65.4 14.3 89.6l112 112c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-112-112c-24.2-24.2-60.6-29-89.6-14.3l-109-109V104c0-7.5-3.5-14.5-9.4-19L78.6 5zM19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L233.7 374.3c-7.8-20.9-9-43.6-3.6-65.1l-61.7-61.7L19.9 396.1zM512 144c0-10.5-1.1-20.7-3.2-30.5c-2.4-11.2-16.1-14.1-24.2-6l-63.9 63.9c-3 3-7.1 4.7-11.3 4.7H352c-8.8 0-16-7.2-16-16V102.6c0-4.2 1.7-8.3 4.7-11.3l63.9-63.9c8.1-8.1 5.2-21.8-6-24.2C388.7 1.1 378.5 0 368 0C288.5 0 224 64.5 224 144l0 .8 85.3 85.3c36-9.1 75.8 .5 104 28.7L429 274.5c49-23 83-72.8 83-130.5zM56 432a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path></svg>
            </div>    
            <h3>Expert Support</h3>
            <p>Dedicated technical support and maintenance services to keep your operations running smoothly</p>
          </motion.div>
          <motion.div 
          className="feature-item"
          initial={{ opacity: 0, y:50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}>
            <div className="icon-circle">
              <svg className="svg-inline--fa fa-truck small-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="truck" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" data-fa-i2svg=""><path fill="#E50914" d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path></svg>
            </div>
            <h3>Nationwide Delivery</h3>
            <p>Fast and secure delivery across the Philippines, from Luzon to Mindanao</p>
          </motion.div>
        </motion.div>
      </motion.div>
      <motion.div className='featured-equipment' variants={sectionVariants}>
        <div className='featured-equipment-header'>
          <p className='featured-equipment-header-Title'>Featured Equipment</p>
          <p className='featured-equipment-header-Desc'>Discover our most popular heavy machinery</p>
        </div>
        <div className='Products'>
          {products.slice(0, 6).map((item, index) => (
            <ProductCard
              key={item.id}
              id={item.id}
              image={item.images?.[0]}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </motion.div>
      <motion.div 
        className='HomepageLastSection'
          initial={{ opacity: 0, y:50 }}
          whileInView={{ opacity: 1, y:0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          viewport={{ amount: 0.5 }}>
          <div>
            <p className='LastSectionTitle'>Not sure what you need? <br /> Let our team help.</p>
            <p className='LastSectionDesc'>Our equipment specialists are ready to recommend the perfect solution for your project</p>
          </div>
          <div>
            <Link to="/contact"><button className='TalkToUsButton'>Talk to Us</button></Link>
          </div>
      </motion.div>
      <Footer />
    </motion.div>
    </div>
  );
}

export default Home;
