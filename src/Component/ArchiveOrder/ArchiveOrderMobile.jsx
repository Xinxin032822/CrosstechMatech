import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Data/firebase';
import './ArchiveOrderMobile.css';

const ArchiveOrderMobile = () => {
  const [archivedOrders, setArchivedOrders] = useState([]);

  useEffect(() => {
    const fetchArchivedOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orderHistory'));
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          archivedAt: doc.data().archivedAt?.toDate().toLocaleString() || 'N/A',
        }));
        setArchivedOrders(orders);
      } catch (error) {
        console.error('Error fetching archived orders:', error);
      }
    };

    fetchArchivedOrders();
  }, []);

  return (
    <div className='archive-orders-mobile'>
      <h2 className='archive-title'>Order History</h2>
      {archivedOrders.length === 0 ? (
        <p className="empty-message">No archived orders found.</p>
      ) : (
        archivedOrders.map(order => (
          <div key={order.id} className='order-card'>
            <p><strong>Customer:</strong> {order.fullName}</p>
            <p><strong>Product:</strong> {order.productName}</p>
            <p><strong>Price:</strong> ₱{order.productPrice}</p>
            <p><strong>Status:</strong> {order.paymentStatus}</p>
            <p><strong>Archived At:</strong> {order.archivedAt}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ArchiveOrderMobile;
