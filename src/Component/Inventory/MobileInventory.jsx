import React, { useState, useEffect } from 'react';
import './MobileInventory.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { collection, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../Data/firebase';

function MobileInventory() {
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
    const newmaxstock = added === 1 ? newQuantity : newQuantity;

    const updatedData = {
      quantity: newQuantity,
      maxstock: newmaxstock,
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
    <div className="mobile-inventory-container">
      <h2 className="mobile-title">Inventory</h2>

      {products.length === 0 && <p className="mobile-empty">No products in inventory.</p>}

      <div className="mobile-cards">
        {products.map(product => {
          const totalPrice = (product.price || 0) * (product.quantity || 0);
          const percentage = (product.quantity / (product.maxstock || 1)) * 100;
          const isLow = percentage <= 15;

          return (
            <div className="mobile-card" key={product.id}>
              <div className="mobile-flex">
                <div className="mobile-progressbar">
                  <CircularProgressbar
                    value={percentage}
                    text={`${Math.round(percentage)}%`}
                    styles={buildStyles({
                      pathColor: isLow ? 'red' : 'green',
                      textColor: isLow ? 'red' : 'green',
                      trailColor: '#eee',
                      textSize: '24px'
                    })}
                  />
                </div>

                <div className="mobile-info">
                  <div>
                    <h3 className="mobile-product-name">{product.productName || 'Unnamed Product'}</h3>
                    <p><strong>Unit Price:</strong> ₱{(product.price || 0).toFixed(2)}</p>
                    <p><strong>Total:</strong> ₱{totalPrice.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> {product.quantity || 0}</p>
                  </div>

                  {editingId === product.id ? (
                    <div className="mobile-edit">
                      <input
                        type="number"
                        min="1"
                        value={addAmount}
                        onChange={(e) => setAddAmount(Number(e.target.value))}
                        placeholder="Add qty"
                      />
                      <div className="mobile-buttons">
                        <button onClick={() => handleConfirmAdd(product.id)}>✔</button>
                        <button onClick={() => setEditingId(null)}>✖</button>
                      </div>
                    </div>
                  ) : (
                    <button className="mobile-add-btn" onClick={() => handleAddClick(product.id)}>+ Add</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MobileInventory;
