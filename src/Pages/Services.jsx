import "../Styles/Services.css"
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Data/firebase'
import Footer from "../Component/Footer/Footer"
import React, { useEffect, useState, useRef } from 'react';
import ServicesCards from "../Component/ServicesCards/ServicesCards"
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from 'react-router-dom';

function AnimatedSection({ children, ...props }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function Services() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate(); // Add this

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'services'));
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleOnlickServiceCard = (service) => {
    navigate(`/services/${service.id}`);
  };

  const titleVariant = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };


    const subheaderVariant = {
      hidden: { x: -100, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 0.8,
          delay: 0.2,
          ease: 'easeOut',
        },
      },
    };  

  return (
    <div className='MainServicesBody'>
        <div className='HeadLine'>
          <motion.p 
            variants={titleVariant}
            initial="hidden"
            animate="visible"
            className='headlineTitle'>Services</motion.p>
          <motion.p 
            variants={subheaderVariant}
            initial="hidden"
            animate="visible"
            className='headlineDesc'>
            We provide complete industrial support — from equipment servicing and system diagnostics to custom fabrication and onsite repairs.
          </motion.p>
        </div>

      <div className='Cards'>
        {services.map(service => (
          <ServicesCards
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.images?.[0] || ''}
            category={service.category}
            onClick={() => handleOnlickServiceCard(service)}
          />
        ))}
      </div>

      <AnimatedSection>
        <div className='ForAssistance'>
          <div className="ForAssistanceText">
            <p>For Assistance</p>
          </div>
          <div className="ForAssistanceButton">
            <button className="ButtonAssistance">MESSAGE US</button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className="IndustriesWeServe">
          <div className="industries-content">
            <div className="text-section">
              <h2>
                <span className="highlight">INDUSTRIES WE SERVE</span>
              </h2>
              <p>
                As one of the best heavy equipment service providers in the country,
                our clients come from different industries in various areas of the
                Philippines. We serve all kinds of businesses that require parts and
                services for different models of backhoes, trucks, and other heavy
                equipment. These are often used for a variety of excavation and
                construction projects. If you need assistance, you may{" "}
                <a href="/contact" className="contact-link">contact us</a> or send us a
                message on our{" "}
                <a href="https://www.facebook.com/people/Matech-Fabrication-Heavy-Equipment-Parts-Trading/100072122677086/" className="fb-link">Facebook page</a>.
                We would be glad to help. Let’s build together.
              </p>
            </div>
            <div className="image-section">
              <img src="public\assets\img\hydraulic-repairs-services-e1674055230173.webp" alt="Services" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection>
        <div className='ContactUsFooterServicesPage'>
          <div className="ContactUsSercivePageLast">
            <p>IF YOU NEED HELP CONTACT US</p>
          </div>
          <div className="ContactUsButtonServicePageLast">
            <button>CONTACT US</button>
          </div>
        </div>
      </AnimatedSection>
      <Footer/>
    </div>
  );
}

export default Services;