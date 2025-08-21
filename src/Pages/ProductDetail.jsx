// ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ProductDetail.css';
import { useNavigate } from 'react-router-dom';
import Footer from '../Component/Footer/Footer';
import Loader from '../Component/Loader/Loader';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';


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

  if (!product) return <Loader />;

  return (
    <div>
      <div className="product-detail-container">
        <div className="product-detail-content">
            <div className="product-detail-image-container">
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
              <button className="secondary-button" onClick={() => navigate(`/contact`)}>
                <i className="fas fa-envelope"></i> Inquire
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
