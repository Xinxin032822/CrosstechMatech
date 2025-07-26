import React, { useEffect, useState } from 'react';
import { collectionGroup, getDocs, doc, getDoc, updateDoc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import Loader from '../Loader/Loader';

import { db } from '../../Data/firebase';
import "./DeliveryManagement.css"
import NotFixedLoader from '../Loader/NotFixedLoader';


function DeliveryManagement() {

    const [inquiries, setInquiries] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
    const fetchOrders = async () => {
        setLoading(true);
        try {
        const snapshot = await getDocs(collectionGroup(db, "orders"));
        const orders = snapshot.docs.map(docSnap => {
            const pathParts = docSnap.ref.path.split('/');
            const userId = pathParts[pathParts.indexOf('users') + 1];

            return {
            id: docSnap.id,
            userId,
            ...docSnap.data(),
            };
        });

        const enrichedOrders = await Promise.all(
            orders.map(async (order) => {
            if (!order.productId) return order;
            try {
                const productRef = doc(db, 'products', order.productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                const productData = productSnap.data();
                return {
                    ...order,
                    productImage: productData.imageName || "",
                    category: productData.category || "",
                };
                }
            } catch (err) {
                console.error("Error fetching product data:", err);
            }
            return order;
            })
        );

        setInquiries(enrichedOrders);
        } catch (err) {
        console.error("Error fetching orders:", err);
        } finally {
        setLoading(false);
        }
    };

    fetchOrders();
    }, []);



    const getStatusClass = (status) => {
        switch (status) {
            case 'Pending':
            return 'badge orange';
            case 'In Process':
            return 'badge yellow';
            case 'Delivered':
            return 'badge green';
            default:
            return 'badge';
        }
    };
  return (
    <div className='Main-Delivery-Management-div-class'>
        {/* statuses */}
        <div className='Status-Delivery-Management-div-class'>

            {/* Total Inquiries */}
            <div className='StatusIconsDiv Total-Inquiries-Div'>
            <div>
                <p className="status-title">Total Inquiries</p>
                <p className="status-count">{inquiries.length}</p>
            </div>
            <div className="icon-container blue"><i className="fas fa-envelope"></i></div>
            </div>

            {/* Pending */}
            <div className='StatusIconsDiv Pending-Div'>
            <div>
                <p className="status-title">Pending</p>
                <p className="status-count">
                    {inquiries.filter(i => i.status?.toLowerCase() === 'pending').length}
                </p>
            </div>
            <div className="icon-container orange"><i className="fas fa-clock"></i></div>
            </div>

            {/* In Process */}
            <div className='StatusIconsDiv In-Process-Div'>
            <div>
                <p className="status-title">In Process</p>
                <p className="status-count">
                    {inquiries.filter(i => i.status?.toLowerCase() === 'in process').length}
                </p>
            </div>
            <div className="icon-container yellow"><i className="fas fa-cog"></i></div>
            </div>

            {/* Delivered */}
            <div className='StatusIconsDiv Delivered-Div'>
            <div>
                <p className="status-title">Delivered</p>
                <p className="status-count">
                  {inquiries.filter(i => i.status?.toLowerCase() === 'delivered').length}
                </p>
            </div>
            <div className="icon-container green"><i className="fas fa-check"></i></div>
            </div>

        </div>
        {/* table */}
        <div className="table-container">
            {loading ? (
                <NotFixedLoader />
            ): (
                <>
                    <table className="inquiry-table">
                        <thead>
                            <tr>
                            <th>PRODUCT</th>
                            <th>INQUIRY MESSAGE</th>
                            <th>DATE SUBMITTED</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                        {inquiries.map((inq) => (
                            <tr key={inq.id}>
                            <td>
                                <div className="product-info">
                                <img src={inq.productImage  || "https://via.placeholder.com/40"} alt={inq.productImage } />
                                <div>
                                    <p className="product-name">{inq.productName}</p>
                                    <p className="product-category">₱{inq.productPrice?.toLocaleString()} × {inq.quantity}</p>
                                </div>
                                </div>
                            </td>

                            <td>{inq.notes || "No message"}</td>

                            <td>
                                {inq.createdAt?.toDate
                                ? inq.createdAt.toDate().toLocaleDateString()
                                : "N/A"}
                            </td>

                            <td>
                                <span className={getStatusClass(inq.status)}>
                                {inq.status === 'Pending' && <i className="fas fa-clock"></i>}
                                {inq.status === 'In Process' && <i className="fas fa-cog"></i>}
                                {inq.status === 'Delivered' && <i className="fas fa-check"></i>}
                                <span className="status-label">{inq.status}</span>
                                </span>
                            </td>

                            <td>
                                <span className="view-details" onClick={() => setSelectedOrder(inq)}>
                                    View Details
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {selectedOrder && (
                        <div className="overlay">
                            <div className="modal">
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>✖</button>
                            <h2>Order Details</h2>
                            <img src={selectedOrder.productImage} alt="Product" />
                            <p><strong>Address:</strong> {selectedOrder.address}</p>
                            <p><strong>Product:</strong> {selectedOrder.productName}</p>
                            <p><strong>Price:</strong> ₱{selectedOrder.productPrice?.toLocaleString()}</p>
                            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                            <p><strong>Notes:</strong> {selectedOrder.notes || "No message"}</p>
                            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1).toLowerCase()}</p>
                            <p><strong>Payment Method:</strong> {selectedOrder.payment}</p>
                            <label className='status-label'>
                                <strong>Status:</strong>
                                <select
                                    className={`status-select`}
                                    value={selectedOrder.status}
                                    onChange={async (e) => {
                                    const newStatus = e.target.value;

                                    try {
                                        const orderRef = doc(db, `users/${selectedOrder.userId}/orders/${selectedOrder.id}`);


                                        await updateDoc(orderRef, { status: newStatus });

                                        setSelectedOrder({ ...selectedOrder, status: newStatus });

                                        setInquiries(prev =>
                                        prev.map(order =>
                                            order.id === selectedOrder.id
                                            ? { ...order, status: newStatus }
                                            : order
                                        )
                                        );
                                    } catch (err) {
                                        console.error("Failed to update status:", err);
                                    }
                                    }}
                                    style={{
                                    marginTop: '8px',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    width: 'auto',
                                    fontSize: '0.95rem'
                                    }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Process">In Process</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </label>
                            <p><strong>Submitted:</strong> {selectedOrder.createdAt?.toDate?.().toLocaleDateString() || "N/A"}</p>
                            <button
                                className="delete-btn"
                                onClick={async () => {
                                    if (window.confirm("Archive this order to history?")) {
                                    try {
                                        const orderRef = doc(db, `users/${selectedOrder.userId}/orders/${selectedOrder.id}`);
                                        await addDoc(collection(db, 'orderHistory'), {
                                        ...selectedOrder,
                                        archivedAt: new Date(),
                                        });
                                        await deleteDoc(orderRef);
                                        setInquiries(prev => prev.filter(order => order.id !== selectedOrder.id));
                                        setSelectedOrder(null);
                                    } catch (err) {
                                        console.error("Failed to archive order:", err);
                                    }
                                    }
                                }}>
                                Archive Order
                            </button>

                            </div>
                        </div>
                    )}
                </>
            )}
        

        </div>
        {/* nav */}
        <div>
            <div></div>
            <div></div>
        </div>

    </div>
  )
}

export default DeliveryManagement