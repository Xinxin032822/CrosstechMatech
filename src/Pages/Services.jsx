import "../Styles/Services.css"
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Data/firebase'
import React, { useEffect, useState } from 'react';

import ServicesCards from "../Component/ServicesCards/ServicesCards"

function Services() {
  const [services, setServices] = useState([]);

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

  return (
    <div className='MainServicesBody'>
      <div className='HeadLine'>
        <p className='headlineTitle'>Services</p>
        <p className='headlineDesc'>
          We provide complete industrial support — from equipment servicing and system diagnostics to custom fabrication and onsite repairs.
        </p>
      </div>

      <div className='Cards'>
        {services.map(service => (
          <ServicesCards
            key={service.id}
            title={service.title}
            description={service.description}
            image={service.images?.[0] || ''}
            onClick={() => console.log("Go to:", service.title)}
          />
        ))}
      </div>

      <div className='ForAssistance'>
        <div>
          <p>For Assistance</p>
        </div>
        <div>
          <button>MESSAGE US</button>
        </div>
      </div>

      <div className='IndustriesWeServe'>
        <div>{/* Fill this later */}</div>
      </div>

      <div className='ContactUsFooterServicesPage'>
        <div>
          <p>IF YOU NEED HELP CONTACT US</p>
        </div>
        <div>
          <button>CONTACT US</button>
        </div>
      </div>
    </div>
  );
}

export default Services;