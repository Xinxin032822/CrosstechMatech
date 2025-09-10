import React, { useState, useEffect } from "react";
import "../Styles/UserDashboard.css";
import Footer from "../Component/Footer/Footer";
import { auth, db } from "../Data/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  writeBatch
} from "firebase/firestore";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [searchOrders, setSearchOrders] = useState("");
  const [sortOrders, setSortOrders] = useState("newest");
  const [searchDeliveries, setSearchDeliveries] = useState("");
  const [sortDeliveries, setSortDeliveries] = useState("newest");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        let mergedUser = { ...currentUser };
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          mergedUser = { ...mergedUser, ...userDocSnap.data() };
        }

        setUser(mergedUser);

        const userOrdersRef = collection(db, "users", currentUser.uid, "orders");
        const qOrders = query(
          userOrdersRef,
          where("status", "in", ["Delivered", "Completed"])
        );
        onSnapshot(qOrders, (snapshot) => {
          setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        const qDeliveries = query(
          userOrdersRef,
          where("status", "in", ["Pending", "Processing", "In Transit"])
        );
        onSnapshot(qDeliveries, (snapshot) => {
          setDeliveries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        const addressesRef = collection(db, "users", currentUser.uid, "savedInputs");
        onSnapshot(addressesRef, (snapshot) => {
          setAddresses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
      } else {
        setUser(null);
        setOrders([]);
        setDeliveries([]);
        setAddresses([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleDeleteAddress = async (addressId) => {
    try {
      const addressRef = doc(db, "users", user.uid, "savedInputs", addressId);
      await deleteDoc(addressRef);
      alert("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("There was an error deleting the address.");
    }
  };

  const filteredOrders = orders
    .filter((order) =>
      [order.productName, order.notes, order.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchOrders.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.eta);
      const dateB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.eta);
      return sortOrders === "newest" ? dateB - dateA : dateA - dateB;
    });

  const filteredDeliveries = deliveries
    .filter((delivery) =>
      [delivery.productName, delivery.notes, delivery.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchDeliveries.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt?.toDate ? a.createdAt.toDate() : a.eta);
      const dateB = new Date(b.createdAt?.toDate ? b.createdAt.toDate() : b.eta);
      return sortDeliveries === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div>
      <div className="dashboard">
        <aside className="sidebar">

          {/* sidebar */}
          <div className="profile">
            <h2>{user?.name || "User"}</h2>
            <p>{user?.email}</p>
            <p>{user?.phoneNumber || "No phone linked"}</p>
          </div>
          {/* end sidebar */}
          
        </aside>
        <main className="main">
          <section className="card orders">
            <div className="orders-header">
              <h3>Orders</h3>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchOrders}
                  onChange={(e) => setSearchOrders(e.target.value)}
                />
                <select
                  value={sortOrders}
                  onChange={(e) => setSortOrders(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            <div className="table scrollable">
              <div className="table-header">
                <span>Product</span>
                <span>Date</span>
                <span>Message</span>
                <span>Status</span>
                <span>Qty</span>
              </div>

              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div key={order.id} className="table-row">
                    <span>{order.productName}</span>
                    <span>
                      {order.createdAt?.toDate
                        ? order.createdAt.toDate().toLocaleDateString()
                        : order.eta || "—"}
                    </span>
                    <span>{order.notes}</span>
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                    <span>{order.quantity}</span>
                  </div>
                ))
              ) : (
                <p>No completed orders yet.</p>
              )}
            </div>
          </section>
          <section className="card deliveries">
            <div className="deliveries-header">
              <h3>Deliveries</h3>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Search deliveries..."
                  value={searchDeliveries}
                  onChange={(e) => setSearchDeliveries(e.target.value)}
                />
                <select
                  value={sortDeliveries}
                  onChange={(e) => setSortDeliveries(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            <div className="table scrollable">
              <div className="table-header">
                <span>Product</span>
                <span>Date</span>
                <span>Message</span>
                <span>Status</span>
                <span>Qty</span>
              </div>

              {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="table-row">
                    <span>{delivery.productName}</span>
                    <span>
                      {delivery.createdAt?.toDate
                        ? delivery.createdAt.toDate().toLocaleDateString()
                        : delivery.eta || "—"}
                    </span>
                    <span>{delivery.notes}</span>
                    <span className={`status ${delivery.status.toLowerCase()}`}>
                      {delivery.status}
                    </span>
                    <span>{delivery.quantity}</span>
                  </div>
                ))
              ) : (
                <p>No active deliveries.</p>
              )}
            </div>
          </section>
          <section className="card addresses">
            <h3>Saved Addresses</h3>
            {addresses.length > 0 ? (
              <div className="address-table">
                <div className="address-header">
                  <span>Name & Email</span>
                  <span>Address</span>
                  <span>Phone</span>
                  <span>Saved On</span>
                  <span>Actions</span>
                </div>
                {addresses.map((address) => (
                  <div key={address.id} className="address-row">
                    <span>
                      {address.fullName}
                      <br />
                      {address.email}
                    </span>
                    <span>{address.address}</span>
                    <span>{address.phone}</span>
                    <span>
                      {new Date(address.createdAt?.seconds * 1000).toLocaleDateString()}
                    </span>
                    <span className="address-actions">
                      <button
                        className="delete-address-btn"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Delete
                      </button>
                      <button
                        className={`status-toggle-btn ${address.active ? "active" : "inactive"}`}
                        onClick={async () => {
                          try {
                            const batch = writeBatch(db);
                            const userAddressesRef = collection(db, "users", user.uid, "savedInputs");
                            addresses.forEach((addr) => {
                              const addrRef = doc(userAddressesRef, addr.id);
                              batch.update(addrRef, { active: addr.id === address.id });
                            });

                            await batch.commit();
                          } catch (error) {
                            console.error("Error setting default address:", error);
                            alert("Failed to update address status.");
                          }
                        }}
                      >
                        {address.active ? "Active" : "Inactive"}
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses.</p>
            )}
          </section>
          <div className="logout-container">
            <button className="logout" onClick={() => auth.signOut()}>
              ⎋ Logout
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
