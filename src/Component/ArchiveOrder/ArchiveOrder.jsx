import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Data/firebase';
const ArchiveOrder = () => {
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
    <div className='AdminPageContentAddProductComponentTable'>
      <p className='CurrentProductsAdminPage'>Order History</p>
      <table className='tableAdminPage'>
        <thead className='theadAdminPage'>
          <tr>
            <th className='theadLabelAdminPage'>Customer</th>
            <th className='theadLabelAdminPage'>Product</th>
            <th className='theadLabelAdminPage'>Price</th>
            <th className='theadLabelAdminPage'>Status</th>
            <th className='theadLabelAdminPage'>Date archived</th>
          </tr>
        </thead>
        <tbody className='tbodyAdminPage'>
          {archivedOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.fullName}</td>
              <td>{order.productName}</td>
              <td>₱{order.productPrice}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.archivedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArchiveOrder;
