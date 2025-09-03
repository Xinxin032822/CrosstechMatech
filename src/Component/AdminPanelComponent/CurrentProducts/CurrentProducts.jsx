import React, { useEffect, useState } from 'react';
import './CurrentProducts.css';
import { db } from '../../../Data/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import CardsCurrentProducts from './cardsCurrentProducts/cardsCurrentProducts';

function CurrentProducts({ setActiveSection }) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsArr = [];
        const categorySet = new Set();

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          productsArr.push({ id: docSnap.id, ...data });

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      !category || product.category?.toLowerCase().trim() === category.toLowerCase().trim();

    const matchesSearch =
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, category]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="cp-main-grid">
      <div className="cp-upper-grid">
        <input
          type="text"
          placeholder="Search products..."
          className="cp-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

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

        <button className="cp-add-btn" onClick={() => setActiveSection('product')}>
          Add New Product
        </button>
      </div>

      <div className="cp-list-section">
        <div className="cp-products-grid">
          {currentProducts.map((product) => (
            <CardsCurrentProducts
              key={product.id}
              image={product.images}
              id={product.id}
              name={product.productName}
              category={product.category}
              price={product.price}
              onDelete={handleDelete}   // ✅ passing handleDelete
            />
          ))}
        </div>

        <div className="cp-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          {currentPage > 3 && (
            <>
              <button onClick={() => setCurrentPage(1)}>1</button>
              {currentPage > 4 && <span>...</span>}
            </>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(page =>
              page >= currentPage - 2 && page <= currentPage + 2
            )
            .map(page => (
              <button
                key={page}
                className={currentPage === page ? 'active' : ''}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span>...</span>}
              <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            </>
          )}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default CurrentProducts;
