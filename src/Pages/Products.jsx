import { useState, useEffect } from 'react'
import "../Styles/Product.css"
import FilterCategory from '../Component/FilterCategory/FilterCategory'
import ProductPageCards from '../Component/ProductPageCards/ProductPageCards'
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";

import Footer from '../Component/Footer/Footer'
import CategoryTree from '../Component/CategoryTree/CategoryTree.jsx';

import { db } from '../Data/firebase.js';
import { collection, getDocs } from 'firebase/firestore';



  function Products() {
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
      overlay.style.opacity = "0.2";
    });

    return () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
      }, 1000);
    };
  }, []);
    const [activeCategory, setActiveCategory] = useState(null);
    const [sortOption, setSortOption] = useState('sortByPrice');
    const [searchQuery, setSearchQuery] = useState('');
    const [categoriesTree, setCategoriesTree] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        const productsSnap = await getDocs(collection(db, 'products'));
        const productsData = productsSnap.docs.map(doc => doc.data());

        setAllProducts(productsData);
        
        const paths = productsData.map(product => {
          const fullPath = [product.category, ...(product.subcategories || [])];
          return fullPath.filter(Boolean);
        });

        const buildTree = (paths) => {
          const root = {};

          paths.forEach(path => {
            let current = root;
            path.forEach(part => {
              if (!current[part]) current[part] = {};
              current = current[part];
            });
          });

          const convertToTree = (obj) =>
            Object.entries(obj).map(([name, children]) => ({
              name,
              children: convertToTree(children),
            }));

          return convertToTree(root);
        };

        setCategoriesTree(buildTree(paths));
      };

      fetchCategories();
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
            <div className="products-page-body-item-header">
              <div className="searchBar">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="searchBar-input"
                />  
              </div>


              <div className="filterSorter">
                <select
                  className="filterSorter-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="sortByPrice">Sort by Price</option>
                  <option value="sortByName">Sort by Name</option>
                </select>
              </div>


              <div className="categoryTree">
                <CategoryTree
                  categories={categoriesTree}
                  onSelectCategory={setActiveCategory}
                  products={allProducts}
                />
              </div>
            </div>
            <div className='products-page-body-item'>
              <ProductPageCards 
                activeCategory={activeCategory} 
                sortOption={sortOption}
                searchQuery={searchQuery}
              />
            </div>
        </div>
        <Footer/>
      </motion.div>
    )
  }

  export default Products