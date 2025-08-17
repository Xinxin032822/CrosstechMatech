import React, { useEffect, useState } from "react";
import { db } from "../../../Data/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import "./OrderHistory.css";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "orderHistory"));
        const data = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Error fetching archived orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter(order =>
      [order.productName, order.notes]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.archivedAt?.toDate ? a.archivedAt.toDate() : new Date();
      const dateB = b.archivedAt?.toDate ? b.archivedAt.toDate() : new Date();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

const handleRestore = async (order) => {
  if (!window.confirm("Restore this order to active orders?")) return;

  try {
    const { archivedAt, ...orderData } = order;

    // ✅ Restore to the same orderId inside user's orders
    await setDoc(doc(db, `users/${order.userId}/orders/${order.id}`), {
      ...orderData,
      restoredAt: new Date(),
    });

    // ✅ Delete from archive
    await deleteDoc(doc(db, `orderHistory/${order.id}`));

    setOrders(prev => prev.filter(o => o.id !== order.id));
    console.log(`Order ${order.id} restored successfully`);
  } catch (err) {
    console.error("Failed to restore order:", err);
  }
};

  return (
    <div className="order-history-page">
      <div className="order-history-controls">
        <input
          type="text"
          placeholder="Search by product or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No archived orders found.</p>
      ) : (
        <div className="order-history-list">
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              className="order-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="order-info">
                <img
                  src={order.productImage || "https://via.placeholder.com/60"}
                  alt={order.productName}
                />
                <div>
                  <h4>{order.productName}</h4>
                  <p>₱{order.productPrice?.toLocaleString()} × {order.quantity}</p>
                  <small>Archived: {order.archivedAt?.toDate().toLocaleDateString()}</small>
                  <small> Created: {order.createdAt?.toDate().toLocaleDateString()}</small>
                </div>
              </div>
              <div className="order-actions">
                <button onClick={() => handleRestore(order)}>Restore</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
