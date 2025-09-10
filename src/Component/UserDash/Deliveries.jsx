import React, { useState, useEffect } from "react";
import { db, auth } from "../../Data/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./Orders.css";

function Deliveries() {
const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const q = collection(db, `users/${userId}/orders`);
        const snapshot = await getDocs(q);

        const ordersData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const order = { id: doc.id, ...doc.data() };
            const productsRef = collection(db, "products");
            const prodQuery = query(
              productsRef,
              where("productName", "==", order.productName)
            );
            const prodSnap = await getDocs(prodQuery);

            let productData = null;
            if (!prodSnap.empty) {
              productData = prodSnap.docs[0].data();
            }

            return {
              ...order,
              productImage: productData?.images?.[0] || null,
            };
          })
        );

        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

    const filteredOrders = orders
    .filter(
        (order) =>
        order.status?.toLowerCase() === "delivered" &&
        order.productName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
        if (sort === "name") return a.productName.localeCompare(b.productName);
        return b.createdAt?.seconds - a.createdAt?.seconds;
    });


  if (!userId) {
    return <p>Please log in to see your orders.</p>;
  }

  return (
    <div className="orders-container">
      <div className="orders-controls">
        <input
          type="text"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="orders-search"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="orders-sort"
        >
          <option value="recent">Sort by: Recent</option>
          <option value="name">Sort by: Product Name</option>
        </select>
      </div>
      <div className="orders-list">
        {loading ? (
          <p>Loading orders...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
                <div className="order-details">
                    <h3 className="order-name">{order.productName}</h3>
                    <p className="order-message">
                    <strong>Message:</strong> {order.notes || "N/A"}
                    </p>
                    <p className="order-address">
                    <strong>Address:</strong> {order.address}
                    </p>
                    <p className="order-id">
                    <strong>ID:</strong> {order.productId}
                    </p>
                    <span className={`order-status ${order.status?.toLowerCase()}`}>
                    {order.status}
                    </span>
                </div>
                {order.productImage && (
                    <img
                    src={order.productImage}
                    alt={order.productName}
                    className="order-image"
                    />
                )}
            </div>

          ))
        ) : (
          <p className="orders-empty">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Deliveries