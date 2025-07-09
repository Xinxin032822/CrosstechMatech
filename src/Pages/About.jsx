import React from 'react'
import "../Styles/About.css"
import CardAbouts from '../Component/CardAbouts/CardAbouts'
import Footer from '../Component/Footer/Footer';

import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";


function About() {

  const products = [
    {
      image: '/assets/img/award.svg',
      title: 'Hydraulic Excavator',
      description: 'High-performance excavator for construction and earthmoving projects',
    },
    {
      image: '/assets/img/handshake.svg',
      title: 'Tower Crane',
      description: 'Heavy-duty tower crane for high-rise construction projects',
    },
    {
      image: '/assets/img/shipping-fast.svg',
      title: 'Bulldozer',
      description: 'Powerful bulldozer for earthmoving and site preparation',
    },
    
  ];

  return (
    <motion.div 
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    className='MainElementClass'>
      
      <div className='MainClassUpperSection'>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='FirstHeaderTitleMainClass'>About Matech</p>
          <p className='HeaderDescMainClass'>Discover our story, values, and commitment to excellence in heavy equipment <br /> solutions across the Philippines</p>
        </div>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='SecondHeaderTitleMainClass'>Our Mission</p>
          <p className='HeaderDescMainClass'>Founded in the heart of Davao, Matech has been at the forefront of providing premium heavy equipment <br /> solutions to businesses across the Philippines. Our mission is to empower industries with reliable, high <br />-quality machinery that drives productivity and success.</p>
          <p className='HeaderDescMainClass'>From our humble beginnings in Davao, we've grown into a trusted partner for construction companies, <br /> mining operations, and industrial enterprises nationwide. We believe in building lasting relationships <br /> through exceptional service and unwavering commitment to quality.</p>
        </div>
      </div>

      <div className='OurCoreValuesSection'>
        <p className='OurCoreValues'>Our Core Values</p>
        <div className='CardSectionAboutUsMain'>
          {products.map((item, index) => (
            <CardAbouts
              key={index}
              svg={item.image}
              title={item.title}
              desc={item.description}
            />
          ))}
        </div>
      </div>

      <div className='OurTeamSectionAboutPage'>
          <div className='FirstChildOurTeamSectionAboutPage'>
            <p className='OurTeamHeaderTitle'>Our Team</p>
            <p className='OurTeamHeaderDesc'>Behind Matech's success is a dedicated team of professionals who bring decades of combined experience in heavy equipment and industrial solutions. Our experts understand the unique challenges faced by Filipino businesses and work tirelessly to provide tailored solutions. <br /> <br /> From our sales consultants to our technical support staff, every team member is committed to delivering exceptional service and building long-term partnerships with our clients.</p>
          </div>
          <div className='SecondChildOurTeamSectionAboutPage'>
            <img src="/assets/ourTeam.png" alt="About our team" className='About-Our-Team-Image'/>
          </div>
      </div>

      <div className='OurFacilities'>
          <div className="ChildOurFacilitiesSEctionAboutPage ChildOurFacilitiesSEctionAboutPageFirst">
            <img src="/assets/ourFacilities.png" alt="Our Facilities" className='OurFacilitiesIMG' />
          </div>
          <div className="ChildOurFacilitiesSEctionAboutPage ChildOurFacilitiesSEctionAboutPageSecond">
            <p className='OurFacilitiesHeaderTitle'>Our Facilities</p>
            <p className='OurFacilitiesHeaderDesc'>Our state-of-the-art facility in Davao serves as the hub for our operations across the Philippines. Equipped with modern storage, maintenance bays, and logistics capabilities, we ensure every piece of equipment is properly maintained and ready for deployment. <br /><br /> Our strategic location allows us to efficiently serve clients from Luzon to Mindanao, with dedicated logistics partners ensuring safe and timely delivery of equipment to any location in the Philippines.</p>
            <ul className='ListOurFacilitiesSection'>
              <li className="ListOurFacilities">Climate-controlled storage facility</li>
              <li className="ListOurFacilities">On-site maintenance and inspection</li>
              <li className="ListOurFacilities">Nationwide delivery network</li>
            </ul>
          </div>
      </div>

      <div className='AboutUsFooterSection'>
          <div className='AboutUsFooterSectionFirstChild'>
            <p className='FooterTitleAboutPage'>Ready to Work With Us?</p>
            <p className='FooterDescAboutPage'>Join hundreds of satisfied clients who trust Matech for their heavy <br /> equipment needs. Let's build something great together.</p>
          </div>
          <div className='AboutUsFooterSectionSecondChild'>
            <button className='ViewOurProductAboutPage'>View Our Products</button>
            <button className='ContactUsTodayAboutPage'>Contact Us Today</button>
          </div>
      </div>
      <Footer/>
    </motion.div>
  )
}

export default About