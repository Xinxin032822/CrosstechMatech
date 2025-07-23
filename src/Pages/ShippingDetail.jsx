import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db,auth } from '../Data/firebase';
import '../Styles/ShippingDetail.css';


import Loader from '../Component/Loader/Loader';

function ShippingDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [form, setForm] = useState({    
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

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

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const increaseQty = () => setQuantity(prev => prev + 1);
  const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = async (e) => {
  e.preventDefault();

  const allFieldsFilled = Object.values(form).every(value => value.trim() !== "");
  if (!allFieldsFilled) {
    alert("Please fill in all required fields.");
    return;
  }
  if (!selectedMethod) {
    alert('Please select a payment method');
    return;
  }

  const subtotal = product.price * quantity;
  const shipping = 500;
  const total = subtotal + shipping;

  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to place an order.");
    return;
  }

  try {
    // 🟦 If GCash is selected, call the backend
    if (selectedMethod === "GCash") {
      const response = await fetch('https://7a70bbe3e460.ngrok-free.app/create-gcash-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          name: form.fullName,
          email: form.email,
          userId: user.uid,
          formData: form,
          productInfo: {
            productId: product.id,
            productName: product.productName,
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.invoice_url) {
        await addDoc(collection(db, "users", user.uid, "orders"), {
          ...form,
          payment: selectedMethod,
          quantity,
          productId: product.id,
          productName: product.productName,
          productPrice: product.price,
          subtotal,
          shipping,
          total,
          status: "Pending",
          paymentStatus: "Pending",
          createdAt: serverTimestamp(),
          xenditInvoiceId: data.id,
        });

        // 🔁 Redirect user to the invoice checkout page
        window.location.href = data.invoice_url;
      } else {
        alert("Failed to create GCash invoice.");
        console.error(data);
      }

      return;
    }


    await addDoc(collection(db, "users", user.uid, "orders"), {
      ...form,
      payment: selectedMethod,
      quantity,
      productId: product.id,
      productName: product.productName,
      productPrice: product.price,
      subtotal,
      shipping,
      total,
      status: "Pending",
      paymentStatus: "Pending",
      createdAt: serverTimestamp(),
    });

    alert('Order placed successfully!');
  } catch (error) {
    console.error("Error placing order:", error);
    alert("Something went wrong while placing the order.");
  }
};



  if (!product) return <Loader/>;

  const subtotal = product.price * quantity;
  const shipping = 500;
  const total = subtotal + shipping;

  return (
    <div>
      <div className="shipping-container">
        <form className="shipping-form" onSubmit={handleSubmit}>
          <div className='form-section-shipping-details'>
            <h2>Shipping Details</h2>
            {["fullName", "phone", "email"].map((field, idx) => (
              <div key={idx} className='form-group-shipping-details'>
                <input
                  className='Input-shipping-details-form'
                  name={field}
                  placeholder={`Enter your ${field === "fullName" ? "full name" : field}`}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <div className='form-group-shipping-details'>
              <textarea
                className='Input-shipping-details-form'
                name="address"
                placeholder="Enter your complete address"
                onChange={handleChange}
                required
              />
            </div>
            <div className='form-group-shipping-details'>
              <textarea
                className='Input-shipping-details-form'
                name="notes"
                placeholder="Any special instructions?"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <h3>Payment Method</h3>
            <div className="payment-methods">
              {[
                { label: "PayPal", icon: "paypal.png" },
                { label: "GCash", icon: "gcash.png" },
                { label: "Cash on Delivery", icon: "COD.png" },
                { label: "Bank Transfer", icon: "bank.png" },
              ].map((method) => (
                <div
                  key={method.label}
                  className={`payment-option ${selectedMethod === method.label ? 'active' : ''}`}
                  onClick={() => setSelectedMethod(method.label)}
                >
                  <img
                    className="paymentIcon"
                    src={`/assets/ShippingDetailAssets/${method.icon}`} 
                    alt={method.label}
                  />
                  <span>{method.label}</span>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-product">
            <img className='productImageShippingDetails' src={product.imageName} alt={product.productName} />
            <div className='summary-product-details'>
              <p className='product-name-shipping-detail-page-header'>{product.productName}</p>
              <div className='quantityShippingDetails'>
                <p className='quantityNumberShippingDetails'>Quantity: {quantity}</p>
                <div className='quantityButtonsShippingDetails'>
                  <button type="button" className='quantityButtonFunctionalShippingDetailsPage' onClick={increaseQty}>
                    <i className="fas fa-plus"></i>
                  </button>
                  <button type="button" className='quantityButtonFunctionalShippingDetailsPage' onClick={decreaseQty}>
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <p className='ItemPriceShippingDetailsPage'>₱{subtotal.toLocaleString()}</p>
            </div>
          </div>
          <hr />
          <div className="summary-details">
            <p className='prices-summary-details'>Subtotal: <span className='dynamic-prices-summary-details'>₱{subtotal.toLocaleString()}</span></p>
            <p className='prices-summary-details'>Shipping: <span className='dynamic-prices-summary-details'>₱{shipping.toLocaleString()}</span></p>
            <hr />
            <h4>Total: <span className=''>₱{total.toLocaleString()}</span></h4>
          </div>
          <p className="secure-checkout"><i className="fas fa-shield-halved"></i> Secure Checkout</p>
          <button type="submit" className="place-order-button" onClick={handleSubmit}>Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetail;
