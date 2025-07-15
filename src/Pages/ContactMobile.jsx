import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Footer from '../Component/Footer/Footer.jsx';
import '../Styles/ContactMobile.css';
import { auth, db } from '../Data/firebase';
import { collection, addDoc, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";


const schema = yup.object({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
});

function ContactMobile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to send a message.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const inquiriesRef = collection(userDocRef, "inquiries");

      await addDoc(inquiriesRef, {
        ...data,
        createdAt: new Date(),
      });

      alert("Your message was sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send message. Please try again.");
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
        transition={pageTransition}>
        <div className="contact-mobile-wrapper">
            <div className="contact-mobile-header">
                <motion.h1 
                  variants={titleVariant}
                  initial="hidden"
                  animate="visible">Contact Us</motion.h1>
                <motion.p 
                  variants={subheaderVariant}
                  initial="hidden"
                  animate="visible">Reach out to us about equipment, support, or business inquiries.</motion.p>
            </div>

            <motion.form 
              onSubmit={handleSubmit(onSubmit)} 
              className="contact-mobile-form"
              initial={{ opacity: 0, y:-50 }}
              whileInView={{ opacity: 1, y:0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              viewport={{ amount: 0.5 }}>
                <label>Full Name</label>
                <input {...register("fullname")} />
                {errors.fullname && <p className="error">{errors.fullname.message}</p>}

                <label>Email</label>
                <input {...register("email")} />
                {errors.email && <p className="error">{errors.email.message}</p>}

                <label>Message</label>
                <textarea {...register("message")} rows={4}></textarea>
                {errors.message && <p className="error">{errors.message.message}</p>}

                <button type="submit">Send Message</button>
            </motion.form>

            <motion.div 
              className="contact-mobile-info"
              initial={{ opacity: 0, y:50 }}
              whileInView={{ opacity: 1, y:0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              viewport={{ amount: 0.5 }}
              >
                <h2>Contact Details</h2>

                <div className="contact-info-row">
                    <div className="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 384 512" width="20">
                        <path d="M215.7 499.2C267 435 384 279.4 384 192 384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                    </div>
                    <p className="contact-info-text">Door 59 Mimric Bldg., Sta. Ana Ave., Davao City</p>
                </div>

                <div className="contact-info-row">
                    <div className="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 512 512" width="20">
                        <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64 0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                    </svg>
                    </div>
                    <p className="contact-info-text">+63 925 777 4587</p>
                </div>

                <div className="contact-info-row">
                    <div className="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 512 512" width="20">
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                    </svg>
                    </div>
                    <p className="contact-info-text">dcantuba_08@yahoo.com</p>
                </div>

                <div className="contact-info-row">
                    <div className="contact-info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 512 512" width="20">
                        <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                    </svg>
                    </div>
                    <div className="contact-info-text">
                    <p>Mon–Wed: 8:00am–4:30pm</p>
                    <p>Thurs: 8:00am–4:00pm</p>
                    <p>Fri–Sat: 8:00am–5:00pm</p>
                    </div>
                </div>
            </motion.div>


            <motion.div 
              className="contact-mobile-map"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              viewport={{ amount: 0.5 }}
              >
                <iframe
                title="Location Map"
                src="https://maps.google.com/maps?q=Door%2059B,%20Mimric%20Bldg,%20Sta.%20Ana%20Ave,%20Davao%20City&t=&z=16&ie=UTF8&iwloc=&output=embed"
                frameBorder="0"
                allowFullScreen
                ></iframe>
            </motion.div>

        </div>
        <div className="footer-wrapper">
            <Footer />
        </div>
    </motion.div>
  );
}

export default ContactMobile;
