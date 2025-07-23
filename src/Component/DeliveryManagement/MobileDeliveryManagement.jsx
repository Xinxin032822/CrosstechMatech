import React, { useEffect, useState } from 'react';
import { collectionGroup, getDocs, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Data/firebase';
import './MobileDeliveryManagement.css';

function MobileDeliveryManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const snapshot = await getDocs(collectionGroup(db, "orders"));
        const ordersData = snapshot.docs.map(docSnap => {
          const pathParts = docSnap.ref.path.split('/');
          const userId = pathParts[pathParts.indexOf('users') + 1];
          return {
            id: docSnap.id,
            userId,
            ...docSnap.data()
          };
        });

        const enrichedOrders = await Promise.all(ordersData.map(async (order) => {
          if (!order.productId) return order;
          try {
            const productSnap = await getDoc(doc(db, 'products', order.productId));
            if (productSnap.exists()) {
              const product = productSnap.data();
              return {
                ...order,
                productName: product.name,
                productImage: product.imageName,
                productPrice: product.price,
              };
            }
          } catch (e) {
            console.error("Error getting product:", e);
          }
          return order;
        }));

        setOrders(enrichedOrders);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (order) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const ref = doc(db, `users/${order.userId}/orders/${order.id}`);
      await deleteDoc(ref);
      setOrders(prev => prev.filter(o => o.id !== order.id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStatusChange = async (order, newStatus) => {
    try {
      const ref = doc(db, `users/${order.userId}/orders/${order.id}`);
      await updateDoc(ref, { status: newStatus });
      setOrders(prev =>
        prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o)
      );
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // 📊 Count statuses
  const total = orders.length;
  const pending = orders.filter(o => o.status?.toLowerCase() === 'pending').length;
  const inProcess = orders.filter(o => o.status?.toLowerCase() === 'in process').length;
  const delivered = orders.filter(o => o.status?.toLowerCase() === 'delivered').length;

  return (
    <div className="mobile-delivery-container">
      <h2>My Orders</h2>

      <div className="mobile-status-summary">
        <div className="status-box total">
          <p>Total</p>
          <span>{total}</span>
        </div>
        <div className="status-box pending">
          <p>Pending</p>
          <span>{pending}</span>
        </div>
        <div className="status-box in-process">
          <p>In Process</p>
          <span>{inProcess}</span>
        </div>
        <div className="status-box delivered">
          <p>Delivered</p>
          <span>{delivered}</span>
        </div>
      </div>

      {orders.map(order => (
        <div key={order.id} className="mobile-order-card">
          <img src={order.productImage || "https://via.placeholder.com/100"} alt="Product" />
          <div className="order-details">
            <h3>{order.productName}</h3>
            <p>₱{order.productPrice?.toLocaleString()} × {order.quantity}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Notes:</strong> {order.notes || "No message"}</p>
            <p><strong>Date:</strong> {order.createdAt?.toDate?.().toLocaleDateString() || "N/A"}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1).toLowerCase()}</p>
          </div>
          <div className="order-actions">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(order, e.target.value)}   
            >
              <option value="Pending">Pending</option>
              <option value="In Process">In Process</option>
              <option value="Delivered">Delivered</option>
            </select>
            <button onClick={() => handleDelete(order)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileDeliveryManagement;
