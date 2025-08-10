// ServicesDetails.jsx
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
        const docRef = doc(db, 'services', id); // fetch from 'services' collection
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
          {/* Image Slider */}
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

          {/* Service Info */}
          <div className="service-detail-info">
            <h2 className="serviceName">{service.title}</h2>

            {/* Optional: Service Features */}
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

            {/* Description */}
            <div className="description-box">
              <h3>Description</h3>
              <p>{service.description}</p>
            </div>

            {/* Call to Action */}
            <div className="action-buttons">
              <button
                className="secondary-button"
                onClick={() => navigate(`/contact`)}
              >
                <i className="fas fa-envelope"></i> Contact Us
              </button>
              <button
                className="primary-button"
                onClick={() => navigate(`/booking/${service.id}`)}
              >
                <i className="fas fa-calendar-check"></i> Message Us
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
