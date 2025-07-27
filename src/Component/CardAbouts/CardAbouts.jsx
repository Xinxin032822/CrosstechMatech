import React from 'react'
import "./CardAbouts.css"
import { motion } from 'framer-motion';

function CardAbouts({svg, title, desc}) {
  return (
    <motion.div
      className='mainCardAboutSection'
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ amount: 0.5}}>
        <div className='ImageContainerAboutSection'>
            <img src={svg} alt={title}  className='imgCardAbout'/>
        </div>
        <div>
            <h3 className='TitleCardAboutUsSection'>{title}</h3>
            <p className='DescCardAboutUsSection'>{desc}</p>
        </div>
    </motion.div>
  )
}

export default CardAbouts