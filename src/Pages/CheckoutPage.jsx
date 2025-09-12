import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../Data/firebase";
import "../Styles/CheckoutPage.css";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const cartRef = collection(db, `users/${user.uid}/cart`);
      const snapshot = await getDocs(cartRef);

      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = { id: docSnap.id, ...docSnap.data() };
          const productRef = doc(db, "products", data.productId);
          const productSnap = await getDoc(productRef);

          return {
            ...data,
            maxQuantity: productSnap.exists()
              ? productSnap.data().quantity
              : 0,
          };
        })
      );

      setCartItems(items);
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingTotal = cartItems.reduce(
    (acc, item) => acc + (item.shippingFee || 0),
    0
  );
  const grandTotal = subtotal + shippingTotal;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    try {
      const user = auth.currentUser;
      const invoicePayload = {
        amount: grandTotal,
        name: form.fullName,
        email: form.email,
        userId: user ? user.uid : null,
        formData: form,
        productInfo: cartItems.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      let invoiceResponse = null;
      if (selectedMethod === "GCash") {
        invoiceResponse = await fetch(
          "https://us-central1-crosstechmatech-aa4c1.cloudfunctions.net/api/create-gcash-invoice",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoicePayload),
          }
        );
      }

      const invoiceData = invoiceResponse
        ? await invoiceResponse.json()
        : null;

      const orderData = {
        ...form,
        payment: selectedMethod,
        items: cartItems,
        subtotal,
        shipping: shippingTotal,
        total: grandTotal,
        status: "Pending",
        paymentStatus: "Pending",
        createdAt: serverTimestamp(),
        userId: user ? user.uid : null,
      };

      if (user) {
        await addDoc(collection(db, "users", user.uid, "orders"), orderData);
      } else {
        await addDoc(collection(db, "guestOrders"), orderData);
      }

      if (invoiceData?.invoice_url) {
        window.location.href = invoiceData.invoice_url;
      } else {
        alert("Order placed successfully!");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert(err.message);
    } finally {
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="checkout-wrapper">
        <form className="checkout-form-box" onSubmit={handleSubmit}>
            <h2 className="checkout-title">Shipping Information</h2>

            <div className="checkout-grid">
                <div className="checkout-field">
                <label>Full Name</label>
                <input
                    type="text"
                    name="fullName"
                    placeholder="John Doe"
                    className="checkout-input"
                    onChange={handleChange}
                    value={form.fullName}
                    required
                />
                </div>
                <div className="checkout-field">
                <label>Phone Number</label>
                <input
                    type="text"
                    name="phone"
                    placeholder="09XX XXX XXXX"
                    className="checkout-input"
                    onChange={handleChange}
                    value={form.phone}
                    required
                />
                </div>
            </div>

            <div className="checkout-field">
                <label>Email Address</label>
                <input
                type="email"
                name="email"
                placeholder="example@email.com"
                className="checkout-input"
                onChange={handleChange}
                value={form.email}
                required
                />
            </div>

            <div className="checkout-field">
                <label>Complete Address</label>
                <textarea
                name="address"
                placeholder="House No., Street, Barangay, City"
                className="checkout-textarea"
                onChange={handleChange}
                value={form.address}
                required
                />
            </div>

            <div className="checkout-field">
                <label>Order Notes (Optional)</label>
                <textarea
                name="notes"
                placeholder="Any special delivery instructions?"
                className="checkout-textarea"
                onChange={handleChange}
                value={form.notes}
                />
            </div>

            <h3 className="checkout-subtitle">Payment Method</h3>
            <div className="checkout-methods">
                {[
                { name: "GCash", icon: "💳" },
                { name: "Cash on Delivery", icon: "📦" },
                { name: "Other Methods", icon: "👜" },
                ].map((method) => (
                <div
                    key={method.name}
                    className={`checkout-method-card ${
                    selectedMethod === method.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedMethod(method.name)}
                >
                    <span className="method-icon">{method.icon}</span>
                    <span>{method.name}</span>
                </div>
                ))}
            </div>
        </form>


      {/* ORDER SUMMARY */}
      <div className="checkout-summary-box">
        <h3 className="checkout-subtitle">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            <img
              src={item.image}
              alt={item.productName}
              className="checkout-summary-img"
            />
            <div>
              <p>{item.productName}</p>
              <p>Qty: {item.quantity}</p>
              <p>₱{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          </div>
        ))}
        <hr />
        <p>Subtotal: ₱{subtotal.toLocaleString()}</p>
        <p>Shipping: ₱{shippingTotal.toLocaleString()}</p>
        <h4>Total: ₱{grandTotal.toLocaleString()}</h4>
        <button
          type="submit"
          form="checkout-form-box"
          className="checkout-place-btn"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
