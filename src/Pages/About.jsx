import React from 'react'
import "../Styles/About.css"
import CardAbouts from '../Component/CardAbouts/CardAbouts'
import Footer from '../Component/Footer/Footer';

import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";


function About() {
  const navigate = useNavigate();

  const products = [
    {
      image: '/assets/img/award.svg',
      title: 'Commitment to Quality',
      description: 'We deliver precision-made hydraulic and sealing components that meet the highest industry standards.',
    },
    {
      image: '/assets/img/handshake.svg',
      title: 'Trusted Partnerships',
      description: 'We build long-term relationships by understanding each client’s unique needs and offering reliable solutions.',
    },
    {
      image: '/assets/img/shipping-fast.svg',
      title: 'Fast & Reliable Service',
      description: 'From fabrication to delivery, we ensure quick turnaround times and dependable support across the Philippines.',
    }
  ];

  return (
    <motion.div 
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    className='MainElementClass'>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration:1.6, ease: "easeInOut" }}
        viewport={{ amount: 0.5, once: true }}
        className='MainClassUpperSection'>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='FirstHeaderTitleMainClass'>About Matech</p>
          <p className='HeaderDescMainClass'>Discover our story, values, and commitment to precision-engineered hydraulic solutions <br />for industries across the Philippines.</p>
        </div>
        <div className='HeaderSectionMainClassUpperSection'>
          <p className='SecondHeaderTitleMainClass'>Our Mission</p>
          <p className='HeaderDescMainClass'>
            Founded in the heart of Davao City,<br />
            Crosstech Matech has become a reliable partner<br />
            for industries seeking high-quality hydraulic and sealing components.
          </p>
          <br />
          <p className='HeaderDescMainClass'>
            Our mission is to empower local businesses—<br />
            especially those in construction, mining, agriculture, and industrial services—<br />
            with durable, precision-made parts that keep operations running efficiently.
          </p>
          <br />
          <p className='HeaderDescMainClass'>
            From water pump forklifts to hydraulic pistons,<br />
            and from custom-fabricated rod seals and O-rings<br />
            to rubber and HD plastic components,<br />
            we are committed to function, quality, and long-term service.
          </p>
        </div>
      </motion.div>

      <div className='OurCoreValuesSection'>
        <p className='OurCoreValues'>Our Core Values</p>
        <motion.div 
          className='CardSectionAboutUsMain'>
          {products.map((item, index) => (
            <CardAbouts
              key={index}
              svg={item.image}
              title={item.title}
              desc={item.description}
            />
          ))}
        </motion.div>
      </div>

      <div className='OurTeamSectionAboutPage'>
          <motion.div 
            className='FirstChildOurTeamSectionAboutPage'
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.4 }}>
            <p className='OurTeamHeaderTitle'>Our Team</p>
            <p className='OurTeamHeaderDesc'>
              Behind Crosstech Matech is a team of experienced professionals who understand the complexities of hydraulic systems and the urgent demands of industrial operations. 
              <br /><br />
              From fabrication specialists to logistics coordinators, each member plays a key role in ensuring accuracy, quick turnaround, and client satisfaction. We don’t just sell parts—we provide solutions.
            </p>
          </motion.div>
          <motion.div 
            className='SecondChildOurTeamSectionAboutPage'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.5 }}>
            <img src="/assets/ourTeam.png" alt="About our team" className='About-Our-Team-Image'/>
          </motion.div>
      </div>

      <div className='OurFacilities'>
          <motion.div 
            className="ChildOurFacilitiesSEctionAboutPage ChildOurFacilitiesSEctionAboutPageFirst"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.5 }}>
            <img src="/assets/ourFacilities.png" alt="Our Facilities" className='OurFacilitiesIMG' />
          </motion.div>
          <motion.div 
            className="ChildOurFacilitiesSEctionAboutPage ChildOurFacilitiesSEctionAboutPageSecond"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.4 }}>
            <p className='OurFacilitiesHeaderTitle'>Our Facilities</p>
            <p className='OurFacilitiesHeaderDesc'>Our Davao-based facility is equipped with the tools and systems necessary to fabricate, inspect, and store a wide range of hydraulic components.</p>
            <ul className='ListOurFacilitiesSection'>
              <li className="ListOurFacilities">Climate-controlled storage facility</li>
              <li className="ListOurFacilities">On-site maintenance and inspection</li>
              <li className="ListOurFacilities">Nationwide delivery network</li>
              <li className="ListOurFacilities">Secure, organized storage of ready-to-ship parts</li>
            </ul>
          </motion.div>
      </div>

      <motion.div 
        className='AboutUsFooterSection'
        initial={{ opacity: 0, x:150 }}
        whileInView={{ opacity: 1, x:0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        viewport={{ amount: 0.5 }}>
          <div className='AboutUsFooterSectionFirstChild'>
            <p className='FooterTitleAboutPage'>Ready to Work With Us?</p>
            <p className='FooterDescAboutPage'>Join hundreds of satisfied clients who trust Matech for their heavy <br /> equipment needs. Let's build something great together.</p>
          </div>
          <div className='AboutUsFooterSectionSecondChild'>
            <button className='ViewOurProductAboutPage' onClick={() => navigate(`/products`)}>View Our Products</button>
            <button className='ContactUsTodayAboutPage' onClick={() => navigate(`/contact`)}>Contact Us Today</button>
          </div>
      </motion.div>
      <Footer/>
    </motion.div>
  )
}

export default About