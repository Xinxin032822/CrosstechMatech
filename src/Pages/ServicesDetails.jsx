import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Data/firebase';
import '../Styles/ServicesDetails.css';
import Footer from '../Component/Footer/Footer';
import Loader from '../Component/Loader/Loader';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ServicesDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const docRef = doc(db, 'services', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setService({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [id]);

  if (!service) return <Loader />;

  return (
    <div>
      <div className="service-detail-container">
        <div className="service-detail-content">
          <div className="service-detail-image-container">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              className="service-image-swiper"
            >
              {(service.images || []).map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`service-${idx}`}
                    className="service-detail-image"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="service-detail-info">
            <h2 className="serviceName">{service.title}</h2>

            <ul>
              <li>
                <span style={{ fontWeight: "bold", color: "#333" }}>Category:</span>
                <span style={{ color: "#555" }}>{service.category || "N/A"}</span>
              </li>
              <li>
                <span style={{ fontWeight: "bold", color: "#333" }}>Subcategory:</span>
                <span style={{ color: "#555" }}>
                  {Array.isArray(service.subcategories) && service.subcategories.length > 0
                    ? service.subcategories.join(" > ")
                    : "N/A"}
                </span>
              </li>
            </ul>

            {service.price && (
              <div className="price-box" style={{ marginTop: "1.5rem" }}>
                <div>
                  <span className="starting-label">Starting from</span>
                  <h2 className="price">₱{Number(service.price).toLocaleString()}</h2>
                </div>
              </div>
            )}

            {service.features?.length > 0 && (
              <div className="features-box">
                <h3>Key Features</h3>
                <ul>
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="description-box">
              <h3>Description</h3>
              <p>{service.description}</p>
            </div>

            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={() => navigate(`/contact`)}
              >
                <i className="fas fa-envelope"></i> Contact Us
              </button>
              <button
                className="primary-button"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <i className="fab fa-facebook-messenger"></i> Message Us
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ServicesDetails;
