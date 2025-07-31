import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Data/firebase';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [addAmount, setAddAmount] = useState(0);

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
    });

    return () => unsubscribe();
  }, []);

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
      <h2 className="inventory-title">Inventory</h2>

      {products.length === 0 && <p className="empty-message">No products in inventory.</p>}

      <div className="inventory-grid">
        {products.map(product => {
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
