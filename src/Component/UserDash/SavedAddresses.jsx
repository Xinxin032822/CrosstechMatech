import React, { useState, useEffect } from "react";
import { db, auth } from "../../Data/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import "./SavedAddresses.css";

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const fetchAddresses = async () => {
    if (!userId) return;

    try {
      const q = collection(db, `users/${userId}/savedInputs`);
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setAddresses(data);
    } catch (err) {
      console.error("Error fetching saved addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  // Toggle active address
  const handleSetActive = async (id) => {
    if (!userId) return;

    try {
      const q = collection(db, `users/${userId}/savedInputs`);
      const snapshot = await getDocs(q);

      const batchUpdates = snapshot.docs.map((docSnap) =>
        updateDoc(doc(db, `users/${userId}/savedInputs`, docSnap.id), {
          isActive: docSnap.id === id, // true for the selected one, false for others
        })
      );

      await Promise.all(batchUpdates);

      fetchAddresses(); // refresh list
    } catch (err) {
      console.error("Error setting active address:", err);
    }
  };

  if (!userId) {
    return <p>Please log in to see your saved addresses.</p>;
  }

  return (
    <div className="saved-addresses-container">
      <h2 className="saved-addresses-title">Saved Addresses</h2>
      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length > 0 ? (
        <div className="saved-addresses-list">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`saved-address-card ${addr.isActive ? "active" : ""}`}
            >
              <h3 className="saved-address-name">{addr.fullName}</h3>
              <p className="saved-address-line">
                <strong>Address:</strong> {addr.address}
              </p>
              <p className="saved-address-line">
                <strong>Phone:</strong> {addr.phone}
              </p>
              <p className="saved-address-line">
                <strong>Email:</strong> {addr.email}
              </p>
              {addr.notes && (
                <p className="saved-address-line">
                  <strong>Notes:</strong> {addr.notes}
                </p>
              )}
              {addr.isActive && (
                <span className="saved-address-status">Active</span>
              )}

              {!addr.isActive && (
                <button
                  className="saved-address-btn"
                  onClick={() => handleSetActive(addr.id)}
                >
                  Set as Active
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No saved addresses found.</p>
      )}
    </div>
  );
}
