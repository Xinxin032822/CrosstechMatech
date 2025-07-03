import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ShippingDetail.css';

function ShippingDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');


  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProduct();
  }, [id]);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    payment: ''
  });

  const subtotal = product?.price || 0;
  const shipping = 500;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="shipping-container">
      <form className="shipping-form" onSubmit={handleSubmit}>
        <h2>Shipping Details</h2>
        
        <div>
            <input name="fullName" placeholder="Enter your full name" onChange={handleChange} required />
        </div>
        <div>
            <input name="phone" placeholder="Enter your phone number" onChange={handleChange} required />
        </div>
        <div>
            <input name="email" placeholder="Enter your email address" onChange={handleChange} required />
        </div>
        <div>
            <textarea name="address" placeholder="Enter your complete address" onChange={handleChange} required />
        </div>
        <div>
            <textarea name="notes" placeholder="Any special instructions?" onChange={handleChange} />
        </div>

        <h3>Payment Method</h3>
        <div className="payment-methods">
        {[
            { label: "PayPal", icon: "/assets/paypal.png" },
            { label: "GCash", icon: "/assets/gcash.png" },
            { label: "Cash on Delivery", icon: "/assets/cod.png" },
            { label: "Bank Transfer", icon: "/assets/bank.png" },
        ].map((method) => (
            <div
            key={method.label}
            className={`payment-option ${selectedMethod === method.label ? 'active' : ''}`}
            onClick={() => setSelectedMethod(method.label)}
            >
            <img src={method.icon} alt={method.label} />
            <span>{method.label}</span>
            </div>
        ))}
        </div>

      </form>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-product">
          <img src={product.imageName} alt={product.productName} />
          <div>
            <p>{product.productName}</p>
            <p>Quantity: 1</p>
            <p>₱{Number(subtotal).toLocaleString()}</p>
          </div>
        </div>
        <hr />
        <div className="summary-details">
          <p>Subtotal: <span>₱{subtotal.toLocaleString()}</span></p>
          <p>Shipping: <span>₱{shipping.toLocaleString()}</span></p>
          <p>Tax: <span>₱{tax.toLocaleString()}</span></p>
          <h4>Total: ₱{total.toLocaleString()}</h4>
        </div>
        <p className="secure-checkout">🔒 Secure Checkout</p>
        <button className="place-order-button" onClick={handleSubmit}>Place Order</button>
      </div>
    </div>
  );
}

export default ShippingDetail;
