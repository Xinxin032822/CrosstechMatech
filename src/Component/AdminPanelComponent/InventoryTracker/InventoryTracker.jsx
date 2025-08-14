import React, { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../Data/firebase";
import { motion } from "framer-motion";
import "./InventoryTracker.css";

function CircularProgress({ value, max }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = max && max > 0 ? (value / max) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width="80" height="80" className="circular-progress">
      <circle
        className="circular-progress-bg"
        fill="transparent"
        strokeWidth="8"
        r={radius}
        cx="40"
        cy="40"
      />
      <motion.circle
        className={`circular-progress-bar ${progress <= 20 ? "low" : "ok"}`}
        fill="transparent"
        strokeWidth="8"
        r={radius}
        cx="40"
        cy="40"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 0.5 }}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="circular-progress-text"
      >
        {isNaN(value) ? 0 : value}
      </text>
    </svg>
  );
}

function InventoryTracker() {
  const [products, setProducts] = useState([]);
  const [manualChanges, setManualChanges] = useState({}); // store manual inputs per product

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setProducts(items);
    });
    return () => unsub();
  }, []);

  const updateStock = async (id, currentQty, change, maxStock) => {
    const newQty = Math.max(0, currentQty + change);

    await updateDoc(doc(db, "products", id), {
      quantity: newQty,
      maxstock:
        change > 0 && (!maxStock || newQty > maxStock) ? newQty : maxStock || newQty,
    });
  };

  const handleManualChange = (id, value) => {
    setManualChanges((prev) => ({ ...prev, [id]: value }));
  };

  const applyManualChange = (id, currentQty, maxStock) => {
    const change = parseInt(manualChanges[id]) || 0;
    if (change === 0) return;
    updateStock(id, currentQty, change, maxStock);
    setManualChanges((prev) => ({ ...prev, [id]: "" })); // reset after applying
  };

  return (
    <div className="inventory-container">
      <h2>Inventory Tracker</h2>
      <div className="inventory-grid">
        {products.map((p) => {
          const quantity = isNaN(p.quantity) ? 0 : p.quantity;
          const maxStock = isNaN(p.maxstock) ? quantity : p.maxstock;
          const lowStock = quantity <= 5;

          return (
            <motion.div
              key={p.id}
              className={`inventory-card ${lowStock ? "low-stock" : ""}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={p.images?.[0] || "https://via.placeholder.com/150"}
                alt={p.productName}
                className="inventory-image"
              />

              <div className="inventory-body">
                <h4 className="inventory-title">{p.productName}</h4>
                <p className="inventory-meta">
                  {p.category} • {p.subcategories?.join(", ")}
                </p>

                <div className="inventory-footer">
                  <CircularProgress value={quantity} max={maxStock} />

                  <div className="inventory-actions">
                    <button
                      onClick={() => updateStock(p.id, quantity, -1, maxStock)}
                      className="btn btn-subtract"
                    >
                      −
                    </button>
                    <button
                      onClick={() => updateStock(p.id, quantity, 1, maxStock)}
                      className="btn btn-add"
                    >
                      +
                    </button>
                  </div>

                  <div className="manual-input">
                    <input
                      type="number"
                      placeholder="±"
                      value={manualChanges[p.id] || ""}
                      onChange={(e) =>
                        handleManualChange(p.id, e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        applyManualChange(p.id, quantity, maxStock)
                      }
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default InventoryTracker;
