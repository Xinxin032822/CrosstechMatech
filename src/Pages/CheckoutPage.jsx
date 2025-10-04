import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../Data/firebase";
import "../Styles/CheckoutPage.css";
import Gcash from "../../public/assets/ShippingDetailAssets/gcash.png";
import COD from "../../public/assets/ShippingDetailAssets/COD.png";
import Other from "../../public/assets/ShippingDetailAssets/bank.png";

function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName.trim() || form.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters.";
    }
    if (!/^(09\d{9})$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 11-digit phone number (09XXXXXXXXX).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.address.trim() || form.address.length < 10) {
      newErrors.address = "Address must be at least 10 characters.";
    }
    if (!selectedMethod) {
      newErrors.payment = "Please select a payment method.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;
    setIsButtonDisabled(true);

    if (!validateForm()) {
      setIsButtonDisabled(false);
      return;
    }

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
          "https://api-a463eoe22a-uc.a.run.app/create-gcash-invoice",
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
          subtotal,
          shipping: shippingTotal,
          total: grandTotal,
          status: "Pending",
          paymentStatus: "Pending",
          createdAt: serverTimestamp(),
          userId: user ? user.uid : null,
          items: cartItems.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.image || null,
            shippingFee: item.shippingFee || 0,
            maxQuantity: item.maxQuantity || null,
          })),
        };


      let orderRef;
      if (user) {
        orderRef = await addDoc(
          collection(db, "users", user.uid, "orders"),
          orderData
        );
      } else {
        orderRef = await addDoc(collection(db, "guestOrders"), orderData);
      }
      const itemsRef = collection(orderRef, "items");
      for (const item of cartItems) {
        await addDoc(itemsRef, {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          image: item.image || null,
          shippingFee: item.shippingFee || 0,
          maxQuantity: item.maxQuantity || null,
        });
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
            {errors.fullName && (
              <p className="error-text">{errors.fullName}</p>
            )}
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
            {errors.phone && (
              <p className="error-text">{errors.phone}</p>
            )}
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
          {errors.email && (
            <p className="error-text">{errors.email}</p>
          )}
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
          {errors.address && (
            <p className="error-text">{errors.address}</p>
          )}
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
            // { name: "GCash", icon: Gcash },
            { name: "Cash on Delivery", icon: COD },
            // { name: "Other Methods", icon: Other },
          ].map((method) => (
            <div
              key={method.name}
              className={`checkout-method-card ${
                selectedMethod === method.name ? "active" : ""
              }`}
              onClick={() => setSelectedMethod(method.name)}
            >
              <img
                className="checkout-method-icon"
                src={method.icon}
                alt={method.name}
              />
              <span>{method.name}</span>
            </div>
          ))}
        </div>
        {errors.payment && (
          <p className="error-text">{errors.payment}</p>
        )}
      </form>

      <div className="checkout-summary-box">
        <h3 className="checkout-subtitle">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-summary-item">
            {item.image ? (
              <img
                src={item.image}
                alt={item.productName}
                className="checkout-summary-img"
              />
            ) : (
              <div className="checkout-summary-placeholder">No Image</div>
            )}
            <div className="checkout-summary-details">
              <p className="summary-name">{item.productName}</p>
              <p className="summary-qty">Qty: {item.quantity}</p>
              <p className="summary-price">₱{item.price.toLocaleString()}</p>
              {item.shippingFee > 0 && (
                <p className="summary-shipping">Shipping: ₱{item.shippingFee.toLocaleString()}</p>
              )}
            </div>
            <div className="checkout-summary-total">
              ₱{(item.price * item.quantity + (item.shippingFee || 0)).toLocaleString()}
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
          onClick={handleSubmit}
        >
          {isButtonDisabled ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage;
