import React, { useState,useEffect } from 'react';
import './MobileInventory.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../Data/firebase'; 


function MobileInventory() {
  const [editingId, setEditingId] = useState(null);
  const [addAmount, setAddAmount] = useState(0);
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  fetchProducts();
}, []);
  const handleAddClick = (id) => {
    setEditingId(id);
    setAddAmount(0);
  };

  const handleConfirmAdd = (id) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          const newStock = product.stock + Number(addAmount);
          return {
            ...product,
            stock: newStock,
            maxStock: newStock,
          };
        }
        return product;
      })
    );
    setEditingId(null);
  };

  return (
    <div className="mobile-inventory-container">
      <h2 className="mobile-title">Inventory</h2>

      {products.length === 0 && <p className="mobile-empty">No products in inventory.</p>}

      <div className="mobile-cards">
        {products.map((product) => {
          const totalPrice = product.price * product.stock;
          const percentage = (product.stock / product.maxStock) * 100;
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
                      textSize: '24px',
                    })}
                  />
                </div>

                <div className="mobile-info">
                  <div>
                    <h3 className="mobile-product-name">{product.productName}</h3>
                    <p><strong>Unit Price:</strong> ₱{product.price.toFixed(2)}</p>
                    <p><strong>Total:</strong> ₱{totalPrice.toFixed(2)}</p>
                    <p><strong>Quantity:</strong> {product.stock}</p>
                  </div>

                  {editingId === product.id ? (
                    <div className="mobile-edit">
                      <input
                        type="number"
                        min="0"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
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
