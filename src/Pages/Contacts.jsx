import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "../Styles/Contacts.css";
import Footer from '../Component/Footer/Footer.jsx';

import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";

import { collection, addDoc, doc } from 'firebase/firestore';
import { db, auth } from '../Data/firebase';


const schema = yup.object({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
});

function Contacts() {
  useEffect(() => {
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.background = 'url("/background.png") no-repeat center bottom';
      overlay.style.backgroundSize = "cover";
      overlay.style.backgroundAttachment = "scroll";
      overlay.style.opacity = "0";
      overlay.style.transition = "opacity 0.5s ease";
      overlay.style.zIndex = "-1";
      document.body.appendChild(overlay);
  
      requestAnimationFrame(() => {
        overlay.style.opacity = "0.2";
      });
  
      return () => {
        overlay.style.opacity = "0";
        setTimeout(() => {
          overlay.remove();
        }, 1000);
      };
    }, []);
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to send a message.");
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    const inquiriesRef = collection(userDocRef, "inquiries");
    await addDoc(inquiriesRef, {
      fullname: data.fullname,
      email: data.email,
      message: data.message,
      createdAt: new Date(),
    });
    setSuccessMsg("Thank you! We'll get back to you shortly.");
    reset();
  } catch (error) {
    console.error("Error sending inquiry:", error);
    alert("Something went wrong. Please try again later.");
  }
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
    <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={pageTransition}
    >
      <div className='contacts-header'>
        <motion.p 
          className='contacts-header-title'
          variants={titleVariant}
          initial="hidden"
          animate="visible"
          >Contact Us</motion.p>
        <motion.p 
          className='contact-header-desc'
          variants={subheaderVariant}
          initial="hidden"
          animate="visible"
          >Get in touch with our team for inquiries about heavy equipment, <br /> support, or partnership opportunities.</motion.p>
      </div>

      <div className="contacts-container">
        <motion.div 
          className="contact-form-section"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}>
          <p className='SendUsMessageContactUsPage'>Send us a Message</p>
          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div className="form-group">
              <label className='LabeLInputContactUsPage'>Full Name</label>
              <input
                type="text"
                {...register("fullname")}
                className='FormInput FormInputContactUsPage'
              />
              {errors.fullname && <p className="error">{errors.fullname.message}</p>}
            </div>

            <div className="form-group">
              <label className='LabeLInputContactUsPage'>Email</label>
              <input
                type="email"
                {...register("email")}
                className='FormInput FormInputContactUsPage'
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className='LabeLInputContactUsPage'>Message / Inquiry</label>
              <textarea
                {...register("message")}
                rows={4}
                className='FormInput FormInputContactUsPage'
              />
              {errors.message && <p className="error">{errors.message.message}</p>}
            </div>
            
            <button type="submit" className="contact-submit-button">Send Message</button>
            {successMsg && <p className="success-message">{successMsg}</p>}
          </form>
        </motion.div>


        <motion.div 
          className='contact-info-section'
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}>
          <p className='GetInTouchContactUsPage'>Get in Touch</p>
          <div className='contact-info-container'>
            <div className='svg-icon-Container-Contact-Us-Page'>
              <svg className="svg-inline--fa fa-location-dot" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="#FFF" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path></svg>
            </div>
            <div className='contact-info-text'>
              <p className='labelContactInfoSentionContactUsPage'>Address</p>
              <p className='descContactInfoSectionContactUsPage'>Door 59 Mimric Bldg. Sta. Ana Avenue 8000 Brgy. 27C Davao City, Davao City, Philippines</p>
            </div>
          </div>
          <div className='contact-info-container'>
            <div className='svg-icon-Container-Contact-Us-Page'>
              <svg className="svg-inline--fa fa-phone" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="phone" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="#FFF" d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"></path></svg>
            </div>
            <div className='contact-info-text'>
              <p className='labelContactInfoSentionContactUsPage'>Phone Number</p>
              <p className='descContactInfoSectionContactUsPage'>+63 925 777 4587</p>
            </div>
          </div>
          <div className='contact-info-container'>
            <div className='svg-icon-Container-Contact-Us-Page'>
              <svg className="svg-inline--fa fa-clock" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="#FFF" d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"></path></svg>
            </div>
            <div className='contact-info-text'>
              <p className='labelContactInfoSentionContactUsPage'>Operating Hours</p>
              <p className='descContactInfoSectionContactUsPage'>Monday - Wednesday: 8:00am - 4:30pm</p>
              <p className='descContactInfoSectionContactUsPage'>Thursday: 8:00am - 4:00pm</p>
              <p className='descContactInfoSectionContactUsPage'>Friday - Saturday: 8:00am - 5:00pm</p>
            </div>
          </div>
          <div className='contact-info-container'>
            <div className='svg-icon-Container-Contact-Us-Page'>
              <svg className="svg-inline--fa fa-envelope" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="envelope" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="#FFF" d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg>
            </div>
            <div className='contact-info-text'>
              <p className='labelContactInfoSentionContactUsPage'>Email</p>
              <p className='descContactInfoSectionContactUsPage'>dcantuba_08@yahoo.com</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className='map-container'>
        <p className='FindUsTextLowerSectionContactUs'>Find Us</p>
        <div style={{ width: "100%" }}>
          <iframe
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            className='map-iframe'
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Door%2059B,%20Mimric%20Bldg,%20Sta.%20Ana%20Ave,%20Brgy.%2027-C,%20Davao%20City,%208000%20Davao%20del%20Sur+(Matech)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
        </div>
      </div>
      <Footer/>
    </motion.div>
  )
}

export default Contacts