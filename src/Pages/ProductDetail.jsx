import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../Data/firebase';
import { auth } from '../Data/firebase';
import '../Styles/ProductDetail.css';
import Footer from '../Component/Footer/Footer';
import Loader from '../Component/Loader/Loader';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

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

  const handleAddToCart = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to add items to your cart.");
        navigate('/login');
        return;
      }

      const cartItemRef = doc(db, `users/${user.uid}/cart/${product.id}`);
      const cartSnap = await getDoc(cartItemRef);

      if (cartSnap.exists()) {
        await updateDoc(cartItemRef, {
          quantity: increment(1),
        });
      } else {
        await setDoc(cartItemRef, {
          productId: product.id,
          productName: product.productName,
          price: product.price,
          image: product.images?.[0] || null,
          category: product.category,
          shippingFee: product.shippingFee || 0,
          maxQuantity: product.quantity,
          createdAt: serverTimestamp(),
        });
      }

      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (!product) return <Loader />;

  return (
    <div>
      <div className="product-detail-container">
        <div className="product-detail-content">
          <div className="product-detail-image-container">
            {product.images && product.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                className="product-image-swiper"
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      alt={`product-${idx}`}
                      className="product-detail-image"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="no-image-placeholder-detail">
                No Image Available
              </div>
            )}
          </div>

          <div className="product-detail-info">
            <h2 className="productNameProductDetailPage">{product.productName}</h2>

            <div className="specs-box">
              <h3>Specifications</h3>
              <div className="specs-grid">
                {product.specification.map((spec, index) => (
                  <div className="spec-item" key={index}>
                    <span className="spec-title">{spec.title}:</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="description-box">
              <h3>Description</h3>
                <p>{product.description}</p>
            </div>

            <div className="price-box">
              <div>
                <span className="starting-label">Starting from</span>
                <h2 className="price">₱{Number(product.price).toLocaleString()}</h2>
              </div>
              <div className="price-note">
                <p>Flexible payment options available</p>
                <p>Nationwide delivery included</p>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={handleAddToCart}
              >
                <i className="fas fa-cart-plus"></i> Add to Cart
              </button>
              <button
                className="primary-button"
                onClick={() => navigate(`/shipping/${product.id}`)}
              >
                <i className="fas fa-shopping-cart"></i> Buy Now
              </button>
              <p className='AvailableProducts'>{product.quantity} available products</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductDetail;
