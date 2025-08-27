import React, { useEffect, useState } from "react";
import { db } from "../../../Data/firebase";
import {
  collectionGroup,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  setDoc
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../Data/firebase";
import "./DeliveryManagement.css";

function DeliveryManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const userOrderSnap = await getDocs(collectionGroup(db, "orders"));
      const userOrders = userOrderSnap.docs.map((docSnap) => {
        const pathParts = docSnap.ref.path.split("/");
        const userId = pathParts[pathParts.indexOf("users") + 1];
        return {
          id: docSnap.id,
          userId,
          isGuest: false,
          ...docSnap.data(),
        };
      });

      const guestSnap = await getDocs(collection(db, "guestOrders"));
      const guestOrders = guestSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        userId: null,
        isGuest: true,
        ...docSnap.data(),
      }));

      const combinedOrders = [...userOrders, ...guestOrders];

      const enriched = await Promise.all(
        combinedOrders.map(async (order) => {
          if (!order.productId) return order;
          try {
            const productRef = doc(db, "products", order.productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const productData = productSnap.data();
              let imageUrl = Array.isArray(productData.images) && productData.images[0]
                ? productData.images[0]
                : "";

              return {
                ...order,
                productImage: imageUrl,
                category: productData.category || "",
                productName: productData.productName || "",
                productPrice: productData.price || 0,
                quantity: productData.quantity || order.quantity || 0,
              };
            }
          } catch (err) {
            console.error("Error fetching product:", err);
          }
          return order;
        })
      );

      setOrders(enriched);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  const filteredOrders = orders
    .filter((o) =>
      [o.productName, o.notes]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date();
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleStatusChange = async (order, newStatus) => {
    try {
      const orderRef = doc(db, `users/${order.userId}/orders/${order.id}`);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleArchive = async (order) => {
    if (!window.confirm("Archive this order?")) return;

    try {
      await setDoc(doc(db, "orderHistory", order.id), {
        ...order,
        archivedAt: new Date(),
      });
      if (order.isGuest) {
        await deleteDoc(doc(db, `guestOrders/${order.id}`));
      } else {
        await deleteDoc(doc(db, `users/${order.userId}/orders/${order.id}`));
      }
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSelectedOrder(null);

      console.log(`Order ${order.id} archived successfully`);
    } catch (err) {
      console.error("Failed to archive order:", err);
    }
  };


  return (
    <div className="delivery-page">
      <div className="delivery-controls">
        <input
          type="text"
          placeholder="Search by product or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="delivery-summary">
        <div className="summary-card pending">
          <h3>Pending</h3>
          <p>{orders.filter(o => o.status?.toLowerCase() === "pending").length}</p>
        </div>
        <div className="summary-card processing">
          <h3>Processing</h3>
          <p>{orders.filter(o => o.status?.toLowerCase() === "processing").length}</p>
        </div>
        <div className="summary-card delivered">
          <h3>Delivered</h3>
          <p>{orders.filter(o => o.status?.toLowerCase() === "delivered").length}</p>
        </div>
        <div className="summary-card total">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
      </div>

      <div className="delivery-table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="delivery-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Message</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="product-cell">
                        <img
                        src={order.productImage || "https://via.placeholder.com/50"}
                        alt="product"
                        />
                        <div>
                          <p>{order.productName}</p>
                          <small>
                            ₱{order.productPrice?.toLocaleString()} ×{" "}
                            {order.quantity}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>{order.notes || "No message"}</td>
                    <td>
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${order.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selectedOrder && (
        <div className="delivery-modal-overlay">
          <div className="delivery-modal">
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ✖
            </button>
            <h2>Order Details</h2>
            <img
              src={
                selectedOrder.productImage || "https://via.placeholder.com/100"
              }
              alt="product"
            />
            <p><strong>Product:</strong> {selectedOrder.productName}</p>
            <p><strong>Price:</strong> ₱{selectedOrder.productPrice?.toLocaleString()}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Notes:</strong> {selectedOrder.notes || "No message"}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Payment:</strong> {selectedOrder.payment}</p>
            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {selectedOrder.createdAt?.toDate
                ? selectedOrder.createdAt.toDate().toLocaleDateString()
                : "N/A"}
            </p>

            <label>
              Status:
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  handleStatusChange(selectedOrder, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
              </select>
            </label>
                <br />
            <button
              className="archive-btn"
              onClick={() => handleArchive(selectedOrder)}
            >
              Archive Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeliveryManagement;
