import React, { useState } from 'react';
import './Inventory.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const initialProducts = [
  {
    id: '1',
    productName: 'Gaming Laptop',
    price: 52000,
    stock: 10,
    maxStock: 20,
  },
  {
    id: '2',
    productName: 'Bluetooth Headphones',
    price: 1800,
    stock: 12,
    maxStock: 30,
  },
  {
    id: '3',
    productName: 'Wireless Mouse',
    price: 700,
    stock: 5,
    maxStock: 10,
  },
];

function Inventory() {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState(null);
  const [addAmount, setAddAmount] = useState(0);

  const handleAddClick = (id) => {
    setEditingId(id);
    setAddAmount(0);
  };

  const handleConfirmAdd = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              stock: product.stock + Number(addAmount),
            }
          : product
      )
    );
    setEditingId(null);
  };

  return (
    <div className="inventory-container">
    <h2 className="inventory-title">Inventory</h2>

    {products.length === 0 && <p className="empty-message">No products in inventory.</p>}

    <div className="inventory-grid">
        {products.map((product) => {
        const totalPrice = product.price * product.stock;
        const percentage = (product.stock / product.maxStock) * 100;
        const isLow = percentage <= 15;

        return (
            <div className="inventory-card" key={product.id}>
            <h3 className="product-title">{product.productName}</h3>
            <div className="card-content">
                <div className="left_side">
                <div className="prices-row">
                    <p><strong>Unit Price (₱):</strong> {product.price.toFixed(2)}</p>
                    <p><strong>Total Price (₱):</strong> {totalPrice.toFixed(2)}</p>
                </div>
                <p><strong>Quantity:</strong> {product.stock}</p>
                <div className="add-stock">
                    {editingId === product.id ? (
                    <>
                        <input
                        type="number"
                        min="0"
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
