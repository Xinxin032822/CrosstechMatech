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
import "./DeliveryManagement.css";
import NotFixedLoader from "../../Loader/NotFixedLoader"

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
        try {
          if (Array.isArray(order.items) && order.items.length > 0) {
            return {
              ...order,
              multipleItems: true, 
            };
          }
          let items = [];
          if (!order.isGuest) {
            const itemsSnap = await getDocs(
              collection(db, `users/${order.userId}/orders/${order.id}/items`)
            );
            items = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          } else {
            const itemsSnap = await getDocs(
              collection(db, `guestOrders/${order.id}/items`)
            );
            items = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          }

          if (items.length > 0) {
            return {
              ...order,
              items,
              multipleItems: true,
            };
          }
          if (order.productId) {
            const productRef = doc(db, "products", order.productId);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
              const productData = productSnap.data();
              let imageUrl =
                Array.isArray(productData.images) && productData.images[0]
                  ? productData.images[0]
                  : "";

              return {
                ...order,
                multipleItems: false,
                productImage: imageUrl,
                category: productData.category || "",
                productName: productData.productName || "",
                productPrice: productData.price || 0,
                quantity: productData.quantity || order.quantity || 0,
              };
            }
          }

          return order;
        } catch (err) {
          console.error("Error enriching order:", err);
          return order;
        }
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
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  const handleStatusChange = async (order, newStatus) => {
    try {
      let orderRef;
      if (order.isGuest) {
        orderRef = doc(db, `guestOrders/${order.id}`);
      } else {
        orderRef = doc(db, `users/${order.userId}/orders/${order.id}`);
      }
      await updateDoc(orderRef, { status: newStatus });
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
          <div className="loader-wrapper">
            <NotFixedLoader />
          </div>
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
                      {order.multipleItems ? (
                        <div className="product-list-cell">
                          {order.items?.map((item) => (
                            <div key={item.id} className="product-cell">
                              <img
                                src={item.image || "https://via.placeholder.com/50"}
                                alt={item.productName}
                              />
                              <div>
                                <p>{item.productName}</p>
                                <small>
                                  ₱{item.price?.toLocaleString()} × {item.quantity}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="product-cell">
                          <img
                            src={order.productImage || "https://via.placeholder.com/50"}
                            alt={order.productName}
                          />
                          <div>
                            <p>{order.productName}</p>
                            <small>
                              ₱{order.productPrice?.toLocaleString()} × {order.quantity}
                            </small>
                          </div>
                        </div>
                      )}
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
            <div
              className={`delivery-modal ${
                selectedOrder.multipleItems ? "cart-modal" : "single-product-modal"
              }`}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ✖
              </button>
              {selectedOrder && (
                <div className="delivery-modal-overlay">
                  <div
                    className={`delivery-modal ${
                      selectedOrder.multipleItems ? "cart-modal" : "single-product-modal"
                    }`}
                  >
                    <button
                      className="modal-close"
                      onClick={() => setSelectedOrder(null)}
                    >
                      ✖
                    </button>

                    {selectedOrder.multipleItems ? (
                      // 🛒 CART MODAL
                      <>
                        <h2>Cart Order Details</h2>
                        {selectedOrder.items?.map((item) => (
                          <div key={item.id} className="cart-summary-item">
                            <img
                              src={item.image}
                              alt={item.productName || "No product"}
                              className="cart-summary-img"
                            />
                            <div className="cart-summary-details">
                              <p className="cart-summary-name">{item.productName || "Unnamed"}</p>
                              <p className="cart-summary-qty">Qty: {item.quantity}</p>
                            </div>
                            <div className="cart-summary-price">
                              ₱{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      // 📦 SINGLE PRODUCT MODAL
                      <>
                        <h2>Single Product Order Details</h2>
                        <div className="checkout-summary-item">
                          <img
                            src={selectedOrder.productImage}
                            alt={selectedOrder.productName || "No product"}
                            className="checkout-summary-img"
                          />
                          <div className="checkout-summary-details">
                            <p className="summary-name">
                              {selectedOrder.productName || "Unnamed product"}
                            </p>
                            <p className="summary-qty">Qty: {selectedOrder.quantity}</p>
                          </div>
                          <div className="checkout-summary-price">
                            ₱{(selectedOrder.productPrice * selectedOrder.quantity).toLocaleString()}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Common details */}
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
                        onChange={(e) => handleStatusChange(selectedOrder, e.target.value)}
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
        </div>
      )}
      
    </div>
  );
}

export default DeliveryManagement;
