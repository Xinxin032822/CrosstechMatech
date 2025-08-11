import React, { useEffect, useState } from 'react';
import './CurrentProducts.css';
import { db } from '../../../Data/firebase';
import { collection, getDocs } from 'firebase/firestore';
import CardsCurrentProducts from './cardsCurrentProducts/cardsCurrentProducts';

function CurrentProducts() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // 🔹 New state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArr = [];
        const categorySet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          productsArr.push({ id: doc.id, ...data });

          if (data.category) {
            categorySet.add(data.category);
          }
        });

        setProducts(productsArr);
        setCategories(Array.from(categorySet));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Filtered products based on category + search term
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      !category || product.category?.toLowerCase().trim() === category.toLowerCase().trim();

    const matchesSearch =
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="cp-main-grid">
      <div className="cp-upper-grid">
        {/* 🔹 Search Bar */}
        <input
          type="text"
          placeholder="Search products..."
          className="cp-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
        <div className="cp-category-dropdown-group">
          <div className="cp-category-dropdown">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="cp-category-select"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <span className="cp-category-arrow">&#9660;</span>
          </div>
        </div>

        <button className="cp-add-btn">
          Add New Product
        </button>
      </div>

      {/* Product List */}
      <div className="cp-list-section">
        <div className="cp-products-grid">
          {filteredProducts.map((product) => (
            <CardsCurrentProducts
              key={product.id}
              image={product.images}
              name={product.productName}
              category={product.category}
              price={product.price}
              onEdit={() => alert(`Edit ${product.productName}`)}
              onDelete={() => alert(`Delete ${product.productName}`)}
            />
          ))}
        </div>
        <div className="cp-pagination">
          {/* Pagination controls */}
        </div>
      </div>
    </div>
  );
}

export default CurrentProducts;
