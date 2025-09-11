import React, { useEffect, useState } from "react";
import { auth, db } from "../../Data/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const cartRef = collection(db, `users/${user.uid}/cart`);
        const snapshot = await getDocs(cartRef);

        const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
            const cartData = { id: docSnap.id, ...docSnap.data() };
            const productRef = doc(db, "products", cartData.productId);
            const productSnap = await getDoc(productRef);

            let latestStock = 0;
            if (productSnap.exists()) {
            latestStock = productSnap.data().quantity;
            }

            return {
            ...cartData,
            quantity: Number(cartData.quantity) || 1,
            maxQuantity: latestStock,
            };
        })
        );


        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

    const updateQuantity = async (id, newQty) => {
        newQty = Number(newQty);

        setCartItems((prev) =>
            prev.map((item) =>
            item.id === id ? { ...item, quantity: newQty } : item
            )
        );

        const user = auth.currentUser;
        if (!user) return;

        const itemRef = doc(db, `users/${user.uid}/cart`, id);
        await updateDoc(itemRef, { quantity: newQty });
    };


  const removeItem = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    const user = auth.currentUser;
    if (!user) return;

    const itemRef = doc(db, `users/${user.uid}/cart`, id);
    await deleteDoc(itemRef);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingTotal = cartItems.reduce(
    (acc, item) => acc + item.shippingFee,
    0
  );
  const grandTotal = subtotal + shippingTotal;

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <h2 className="cart-item-name">{item.productName}</h2>
                  <p className="cart-item-price">
                    ₱{item.price.toLocaleString()}
                  </p>
                  <p className="cart-item-stock">
                    {item.maxQuantity} available
                  </p>

                  <div className="cart-quantity">
                    <button
                      className="qty-btn"
                      disabled={item.quantity === 1}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      disabled={item.quantity >= item.maxQuantity}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="cart-remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>₱{shippingTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₱{grandTotal.toLocaleString()}</span>
            </div>
            <button className="checkout-btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
