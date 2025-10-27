import React from 'react'
import "./ServicesCards.css"
import { motion } from 'framer-motion'
function ServicesCards({ title, description, image, category, subcategories, price, onClick }) {
  return (
    <motion.div
        className="ServiceCard"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1, background: "#ffffff", boxShadow:"17px 17px 42px #f0f0f0, -17px -17px 42px #ffffff" }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1 }}
    >
      <div className='ImageServicesCards'>
        <img src={image} alt={title} />
      </div>
      <div className='ServicesCardsBriefContent'>
        <div className='ServicesCardsTitle'>
          <h3>{title}</h3>
        </div>
        <div className='ServicesCardsDesc'>
          <p>{description}</p>
        </div>
        <div className='ServicesCardPrice'>
          <p>₱ {price}</p>
        </div>
        <div className='ServicesCardsBottom'>
          <div className='ServicesCardsCategory'>
            <p>{category}</p>
            <p>&nbsp; &gt; &nbsp;</p>
            <p>{subcategories[0]}</p>
          </div>
          <div className='ServicesCardsButton'>
            <button onClick={onClick}>More Details</button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ServicesCards