import React, { useEffect, useRef, useState } from 'react';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../../Data/firebase.js';
  import { motion, AnimatePresence } from 'framer-motion';
  import './FilterCategory.css';

  const FilterCategory = ({ activeCategory, setActiveCategory }) => {
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const categorySet = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.category) {
          categorySet.add(data.category);
        }
      });
      setCategories([...categorySet]);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(prev => (prev === category ? null : category));
    setCategories(prev => {
      const filtered = prev.filter(c => c !== category);
      return [category, ...filtered];
    });
  };

  return (
    <div className='filterCategory'>
      <p className='filterCategory-header'>Filter by Category :</p>
      <div className='filterCategory-wrapper'>
        <motion.div className='filterCategory-items' ref={scrollRef} layout={hasMounted ? "position" : false}>
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.p
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                key={cat}
                className={`filterCategory-item ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </motion.p>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default FilterCategory;
