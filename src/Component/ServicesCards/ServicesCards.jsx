import React from 'react'
import "./ServicesCards.css"
import { motion } from 'framer-motion'
function ServicesCards({ title, description, image, onClick }) {
  return (
    <motion.div
        className="ServiceCard"
  style={{
    background: "#ffffff",
    boxShadow: "17px 17px 42px #f0f0f0, -17px -17px 42px #ffffff",
  }}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
    >
      <div className='ImageServicesCards'>
        <img src={image} alt={title} style={{ borderRadius: "50px 50px 0 0" }} />
      </div>
      <div className='ServicesCardsBriefContent'>
        <div className='ServicesCardsTitle'>
          <h3>{title}</h3>
        </div>
        <div className='ServicesCardsDesc'>
          <p>{description}</p>
        </div>
        <div className='ServicesCardsButton'>
          <button onClick={onClick}>More Details</button>
        </div>
      </div>
    </motion.div>
  )
}

export default ServicesCards