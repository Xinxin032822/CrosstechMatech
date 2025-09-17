import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc, getDoc, addDoc, collection, serverTimestamp, runTransaction,
  query, orderBy, limit, getDocs, where, writeBatch
} from 'firebase/firestore';


import { db, auth } from '../Data/firebase';
import '../Styles/ShippingDetail.css';

import Loader from '../Component/Loader/Loader';

function ShippingDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
  });

  const fetchProduct = async () => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProduct({ id: docSnap.id, ...docSnap.data() });
    }
  };

  useEffect(() => {
    fetchProduct();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadSavedInput(user.uid);
      }
    });

    return () => unsubscribe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };
  const loadSavedInput = async (userId) => {
  try {
    const savedInputsRef = collection(db, 'users', userId, 'savedInputs');
    const qActive = query(savedInputsRef, where('isActive', '==', true), limit(1));
    const activeSnap = await getDocs(qActive);

    let data = null;
    if (!activeSnap.empty) {
      data = activeSnap.docs[0].data();
    } else {
      const qLatest = query(savedInputsRef, orderBy('createdAt', 'desc'), limit(1));
      const latestSnap = await getDocs(qLatest);
      if (!latestSnap.empty) data = latestSnap.docs[0].data();
    }

    if (data) {
      setForm({
        fullName: data.fullName || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        notes: data.notes || '',
      });
      console.log("✅ Loaded saved input:", data);
    }
  } catch (error) {
    console.error("Error loading saved input:", error);
  }
};

const setActiveSavedInput = async (userId, savedInputId) => {
  const ref = collection(db, 'users', userId, 'savedInputs');
  const q = query(ref, where('isActive', '==', true));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.forEach(d => batch.update(d.ref, { isActive: false }));
  batch.update(doc(db, 'users', userId, 'savedInputs', savedInputId), { isActive: true });

  await batch.commit();
};


  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{11}$/.test(form.phone)) {
      newErrors.phone = 'Phone number must be 11 digits';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const increaseQty = () =>
    setQuantity((prev) =>
      prev < Number(product.quantity) ? prev + 1 : prev
    );
  const decreaseQty = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const adjustProductStock = async (productId, orderQty) => {
    const productRef = doc(db, 'products', productId);
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) {
        throw new Error('Product does not exist!');
      }

      const currentStock = productDoc.data().quantity;

      console.log(
        `🛒 Stock before order: ${currentStock}, user ordered: ${orderQty}`
      );

      if (currentStock < orderQty) {
        throw new Error('Not enough stock available.');
      }

      transaction.update(productRef, {
        quantity: currentStock - orderQty,
      });

      console.log(
        `✅ Stock after order: ${currentStock - orderQty}`
      );
    });
  };
  const saveFormData = async (userId, formData, makeActive = true) => {
  try {
    const newDocRef = await addDoc(
      collection(db, 'users', userId, 'savedInputs'),
      {
        ...formData,
        createdAt: serverTimestamp(),
        isActive: !!makeActive,
      }
    );

    if (makeActive) {
      await setActiveSavedInput(userId, newDocRef.id);
    }

    console.log("Form data saved with ID: ", newDocRef.id);
  } catch (error) {
    console.error("Error saving form data: ", error);
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isButtonDisabled) return;

    if (!validateForm()) return;

    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 5000);

    const { fullName, phone, email, address } = form;
    if (![fullName, phone, email, address].every((val) => val.trim() !== '')) {
      alert('Please fill in all required fields.');
      setIsButtonDisabled(false);
      return;
    }

    if (!selectedMethod) {
      alert('Please select a payment method');
      setIsButtonDisabled(false);
      return;
    }

    if (quantity > Number(product.quantity)) {
      alert('Ordered quantity exceeds available stock.');
      setIsButtonDisabled(false);
      return;
    }

    const subtotal = Number(product.price) * quantity;
    const shipping = Number(product.shippingFee);
    const total = subtotal + shipping;

    const user = auth.currentUser;

    try {
      let invoiceResponse = null;

      const invoicePayload = {
        amount: total,
        name: form.fullName,
        email: form.email,
        userId: user ? user.uid : null,
        formData: form,
        productInfo: {
          productId: product.id,
          productName: product.productName,
        },
      };

      if (selectedMethod === 'GCash') {
        invoiceResponse = await fetch(
          'https://us-central1-crosstechmatech-aa4c1.cloudfunctions.net/api/create-gcash-invoice',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoicePayload),
          }
        );
      } else if (selectedMethod === 'Other Methods') {
        invoiceResponse = await fetch(
          'https://us-central1-crosstechmatech-aa4c1.cloudfunctions.net/api/create-card-invoice',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoicePayload),
          }
        );
      }

      let invoiceData = null;
      if (invoiceResponse) {
        invoiceData = await invoiceResponse.json();
      }

      const orderData = {
        ...form,
        payment: selectedMethod,
        quantity,
        productId: product.id,
        productName: product.productName,
        productPrice: Number(product.price),
        subtotal,
        shipping,
        total,
        status: 'Pending',
        paymentStatus: 'Pending',
        createdAt: serverTimestamp(),
        guest: user ? false : true,
        userId: user ? user.uid : null,
        xenditInvoiceId: invoiceData?.id || null,
      };

      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'orders'), orderData);
        await saveFormData(user.uid, form, true);
      } else {
        await addDoc(collection(db, 'guestOrders'), orderData);
      }

      await adjustProductStock(product.id, quantity);

      await fetchProduct();

      if (invoiceData?.invoice_url) {
        window.location.href = invoiceData.invoice_url;
      } else {
        alert('Order placed successfully!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Something went wrong while placing the order.');
      setIsButtonDisabled(false);
    }
  };

  if (!product) return <Loader />;

  const subtotal = Number(product.price) * quantity;
  const shipping = Number(product.shippingFee);
  const total = subtotal + shipping;

  return (
    <div>
      <div className="shipping-container">
        <form className="shipping-form">
          <div className="form-section-shipping-details">
            <h2>Shipping Details</h2>
            {['fullName', 'phone', 'email'].map((field, idx) => (
              <div key={idx} className="form-group-shipping-details">
                <input
                  className="Input-shipping-details-form"
                  name={field}
                  placeholder={`Enter your ${field === 'fullName' ? 'full name' : field}`}
                  onChange={handleChange}
                  value={form[field]}
                  required
                />
                {errors[field] && <p className="error">{errors[field]}</p>}
              </div>
            ))}
            <div className="form-group-shipping-details">
              <textarea
                className="Input-shipping-details-form"
                name="address"
                placeholder="Enter your complete address"
                onChange={handleChange}
                value={form.address}
                required
              />
              {errors.address && <p className="error">{errors.address}</p>}
            </div>
            <div className="form-group-shipping-details">
              <textarea
                className="Input-shipping-details-form"
                name="notes"
                placeholder="Any special instructions?"
                onChange={handleChange}
                value={form.notes}
              />
            </div>
          </div>

          <div>
            <h3>Payment Method</h3>
            <div className="payment-methods">
              {[
                // { label: 'GCash', icon: 'gcash.png' },
                { label: 'Cash on Delivery', icon: 'COD.png' },
                { label: 'Other Methods', icon: 'bank.png' },
              ].map((method) => (
                <div
                  key={method.label}
                  className={`payment-option ${
                    selectedMethod === method.label ? 'active' : ''
                  }`}
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
            {product.images?.[0] ? (
              <img
                className="productImageShippingDetails"
                src={product.images[0]}
                alt={product.productName}
              />
            ) : (
              <div className="no-image-placeholder-shipping">No Image</div>
            )}

            <div className="summary-product-details">
              <p className="product-name-shipping-detail-page-header">{product.productName}</p>
              <div className="quantityShippingDetails">
                <p className="quantityNumberShippingDetails">Quantity: {quantity}</p>
                <div className="quantityButtonsShippingDetails">
                  <button
                    type="button"
                    className="quantityButtonFunctionalShippingDetailsPage"
                    onClick={increaseQty}
                    disabled={quantity >= Number(product.quantity)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                  <button
                    type="button"
                    className="quantityButtonFunctionalShippingDetailsPage"
                    onClick={decreaseQty}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              </div>
              <p className="ItemPriceShippingDetailsPage">
                ₱{subtotal.toLocaleString()}
              </p>
            </div>
          </div>
          <hr />
          <div className="summary-details">
            <p className="prices-summary-details">
              Subtotal: <span className="dynamic-prices-summary-details">₱{subtotal.toLocaleString()}</span>
            </p>
            <p className="prices-summary-details">
              Shipping: <span className="dynamic-prices-summary-details">₱{shipping.toLocaleString()}</span>
            </p>
            <hr />
            <h4>Total: <span>₱{total.toLocaleString()}</span></h4>
          </div>
          <p className="secure-checkout">
            <i className="fas fa-shield-halved"></i> Secure Checkout
          </p>
          <button
            type="submit"
            className="place-order-button"
            onClick={handleSubmit}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? 'Please wait...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShippingDetail;
