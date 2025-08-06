import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Data/firebase';
import './ProductPageCards.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';

function ProductPageCards({ activeCategory, sortOption, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortOption]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const query = searchQuery.trim().toLowerCase();

  let filteredProducts;

  if (query) {
    filteredProducts = products.filter(product =>
      product.productName?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  } else if (activeCategory) {
    const selectedCategory = Array.isArray(activeCategory)
      ? activeCategory[activeCategory.length - 1]
      : activeCategory;

    filteredProducts = products.filter(product => {
      return (
        product.category?.toLowerCase() === selectedCategory?.toLowerCase() ||
        (product.subcategories &&
          product.subcategories.some(
            sub => sub.toLowerCase() === selectedCategory?.toLowerCase()
          ))
      );
    });
  } else {
    filteredProducts = products;
  }

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "sortByPrice") {
      return (a.price || 0) - (b.price || 0);
    } else if (sortOption === "sortByName") {
      return a.productName.localeCompare(b.productName);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  return (
    <div className="product-page-cards-container-main-holder">
      <div className="product-cards-container">
        {currentProducts.map(product => (
          <div className="product-card" key={product.id}>
            <img src={product.images?.[0]} alt={product.productName} className="product-image" />
            <div className="product-content-product-page">
              <h3 className="product-title">{product.productName}</h3>
              <p className="product-description-product-page">{product.description}</p>
              <div className="product-footer">
                <span className="product-category">{product.category}</span>
                <button
                  className="view-details-button"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default ProductPageCards;
