  import React from 'react'
  import { useState } from 'react'
  import "../Styles/Product.css"
  import FilterCategory from '../Component/FilterCategory/FilterCategory'
  import ProductPageCards from '../Component/ProductPageCards/ProductPageCards'

  import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";

import Footer from '../Component/Footer/Footer'
  function Products() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortOption, setSortOption] = useState('sortByPrice');
    
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
    
    return (
      <motion.div
      initial="initial"
      animate="animate"
      exit="exit" 
      variants={pageVariants}
      transition={pageTransition}
      >

        <div className='products-page-container-header'>
          <motion.p 
            className='products-page-header'
            variants={titleVariant}
            initial="hidden"
            animate="visible"
            >Our Equipment Catalog</motion.p>
          <motion.p 
            className='products-page-subheader'
            variants={subheaderVariant}
            initial="hidden"
            animate="visible"
            >
            Browse our comprehensive range of hydraulic parts and industrial components.<br />
            From custom-fabricated seals to high-performance pistons, find the perfect solution for your machinery needs.
          </motion.p>        
        </div>
        <div className='products-page-container-body'>
            <div className='products-page-body-item-header'>
              <div className='filterCategory'>
                <FilterCategory
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </div>
              <div className='filterSorter'>
                <select 
                  className='filterSorter-select'
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="sortByPrice">Sort by Price</option>
                  <option value="sortByName">Sort by Name</option>
                </select>
              </div>
            </div>
            <div className='products-page-body-item'>
              <ProductPageCards 
                activeCategory={activeCategory} 
                sortOption={sortOption}
              />
            </div>
            <div></div>
        </div>
        <Footer/>
      </motion.div>
    )
  }

  export default Products