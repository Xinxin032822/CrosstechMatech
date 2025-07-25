import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import ProductForm from "../Component/ProductForm/ProductForm";
import InquiryManagement from "../Component/InquiryManagement,jsx/InquiryManagement";
import DeliveryManagement from "../Component/DeliveryManagement/DeliveryManagement";
import MobileInquiryManagement from "../Component/InquiryManagement,jsx/MobileInquiryManagement.jsx";
import Loader from "../Component/Loader/Loader.jsx";
import { db, storage } from "../Data/firebase.js";
import {
  FaBoxOpen,
  FaEnvelope,
  FaTruck,
  FaHistory,
} from "react-icons/fa";
import "../Styles/AdminMobile.css";
import MobileDeliveryManagement from "../Component/DeliveryManagement/MobileDeliveryManagement.jsx";
import ArchiveOrder from "../Component/ArchiveOrder/ArchiveOrder.jsx";
import ArchiveOrderMobile from "../Component/ArchiveOrder/ArchiveOrderMobile.jsx";

function AdminMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeNav, setActiveNav] = useState("Product Management");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { key: "Product Management", icon: <FaBoxOpen />, label: "Products" },
    { key: "Inquiry Management", icon: <FaEnvelope />, label: "Inquiries" },
    { key: "Delivery Management", icon: <FaTruck />, label: "Deliveries" },
    { key: "Order History", icon: <FaHistory />, label: "History" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const productToDelete = products.find((p) => p.id === id);
      if (!productToDelete) return;

      const imageUrl = productToDelete.imageName;
      const pathStart = imageUrl.indexOf("/o/") + 3;
      const pathEnd = imageUrl.indexOf("?", pathStart);
      const encodedPath = imageUrl.slice(pathStart, pathEnd);
      const fullPath = decodeURIComponent(encodedPath);
      const imageRef = storageRef(storage, fullPath);
      await deleteObject(imageRef);
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="admin-mobile-wrapper">
      <div className="admin-mobile-container">
        <h1 className="admin-mobile-title">Admin Panel</h1>
        <p>Manage products and customer inquiries</p>

        <div>
          {activeNav === "Product Management" && (
            <>
              <ProductForm />
              <h2 style={{ marginTop: 20 }}>Current Products</h2>
              {loading ? (
                <Loader />
              ) : (
                <div className="admin-mobile-products-list">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="admin-mobile-product-card"
                    >
                      {product.imageName && (
                        <img
                          src={product.imageName}
                          alt={product.productName}
                          className="admin-mobile-product-image"
                        />
                      )}
                      <div className="admin-mobile-product-info">
                        <h3>{product.productName}</h3>
                        <p>Category: {product.category}</p>
                        <p>Price: ₱{product.price}</p>
                      </div>
                      <div className="admin-mobile-product-actions">
                        <button
                          className="admin-mobile-button delete"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav === "Inquiry Management" &&
            (isMobile ? <MobileInquiryManagement /> : <InquiryManagement />)}

          {activeNav === "Delivery Management" &&
            (isMobile ? (
              <MobileDeliveryManagement />
            ) : (
              <DeliveryManagement />
            ))}

          {activeNav === "Order History" &&
            (isMobile ? <ArchiveOrderMobile /> : <ArchiveOrder />)}
        </div>
      </div>

      <nav className="admin-mobile-nav bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`bottom-nav-item ${
              activeNav === item.key ? "active" : ""
            }`}
            onClick={() => setActiveNav(item.key)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default AdminMobile;
