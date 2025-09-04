import React, { useEffect, useState } from "react";
import { db } from "../../../Data/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import "./OrderHistory.css";
import NotFixedLoader from "../../Loader/NotFixedLoader"

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
      const dateA = a.archivedAt?.toDate ? a.archivedAt.toDate() : new Date(0);
      const dateB = b.archivedAt?.toDate ? b.archivedAt.toDate() : new Date(0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    const handleRestore = async (order) => {
      if (!window.confirm("Restore this order to active orders?")) return;

      try {
        const { archivedAt, ...orderData } = order;

        const restoreRef = order.isGuest
          ? doc(db, `guestOrders/${order.id}`)
          : doc(db, `users/${order.userId}/orders/${order.id}`);

        await setDoc(restoreRef, {
          ...orderData,
          restoredAt: new Date(),
        });

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
        <div>
            <NotFixedLoader/>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="NoArchivedDivMainDiv">
          <motion.div
            className="NoArchivedDivMain"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h3 className="noArchivedHeader">
              No Archived Orders
            </h3>
            <p className="noArchivedText">
              Orders that you archive will appear here.  
              Manage active orders from the <span className="">Orders</span> tab.
            </p>
          </motion.div>
        </div>
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
                  <small>
                    Archived: {order.archivedAt?.toDate
                      ? order.archivedAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </small>
                  <small>
                    Created: {order.createdAt?.toDate
                      ? order.createdAt.toDate().toLocaleDateString()
                      : "N/A"}
                  </small>

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
