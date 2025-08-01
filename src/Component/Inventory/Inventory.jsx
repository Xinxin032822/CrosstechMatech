import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';


import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Data/firebase';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addAmount, setAddAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);



  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), snapshot => {
      const productList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          maxstock: data.hasOwnProperty('maxstock') ? data.maxstock : (data.quantity ?? 0)
        };
      });
      setProducts(productList);
      const filteredProducts = products.filter(product =>
        product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    });

    return () => unsubscribe();
  }, []);
  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleAddClick = (id) => {
    setEditingId(id);
    setAddAmount(0);
  };

  const handleConfirmAdd = async (id) => {
    const productToUpdate = products.find(p => p.id === id);
    if (!productToUpdate) return;

    const added = Number(addAmount);
    if (isNaN(added) || added <= 0) return;

    const newQuantity = productToUpdate.quantity + added;
    const newMaxstock = added === 1 ? newQuantity : newQuantity;

    const updatedData = {
      quantity: newQuantity,
      maxstock: newMaxstock,
      updatedAt: new Date()
    };

    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, updatedData);
      setEditingId(null);
    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };

  return (
    <div className="inventory-container">

    <div className='TitleInventorySearchBar'>
      <AnimatePresence mode="wait">
      {editingTitle ? (
        <motion.input
          key="search"
          type="text"
          className="search-bar"
          placeholder="Search for a product..."
          value={searchQuery}
          autoFocus
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={() => setEditingTitle(false)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        />
      ) : (
        <motion.h2
          key="title"
          className="inventory-title"
          onClick={() => setEditingTitle(true)}
          whileHover={{ scale: 1.05, color: '#e50914' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          Inventory
        </motion.h2>
      )}
    </AnimatePresence>
    </div>

 
      {filteredProducts.length === 0 && <p className="empty-message">No products in inventory.</p>}

      <div className="inventory-grid">
        {filteredProducts.map(product => {
          const quantity = product.quantity || 0;
          const maxstock = product.maxstock || 1;
          const percentage = (quantity / maxstock) * 100;
          const isLow = percentage <= 15;
          const totalPrice = (product.price || 0) * quantity;

          return (
            <div className="inventory-card" key={product.id}>
              <h3 className="product-title">{product.productName || 'Unnamed Product'}</h3>
              <div className="card-content">
                <div className="left_side">
                  <div className="prices-row">
                    <p><strong>Unit Price (₱):</strong> {(product.price || 0).toFixed(2)}</p>
                    <p><strong>Total Price (₱):</strong> {totalPrice.toFixed(2)}</p>
                  </div>
                  <p><strong>Quantity:</strong> {quantity}</p>
                  <div className="add-stock">
                    {editingId === product.id ? (
                      <>
                        <input
                          type="number"
                          min="1"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          placeholder="Add qty"
                        />
                        <button onClick={() => handleConfirmAdd(product.id)}>✔</button>
                        <button onClick={() => setEditingId(null)}>✖</button>
                      </>
                    ) : (
                      <button onClick={() => handleAddClick(product.id)}>+ Add</button>
                    )}
                  </div>
                </div>
                <div className="stock-level-wrapper">
                  <div className="progressbar-wrapper">
                    <CircularProgressbar
                      value={percentage}
                      text={`${Math.round(percentage)}%`}
                      styles={buildStyles({
                        pathColor: isLow ? 'red' : 'green',
                        textColor: isLow ? 'red' : 'green',
                        trailColor: '#eee',
                        textSize: '24px',
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Inventory;
