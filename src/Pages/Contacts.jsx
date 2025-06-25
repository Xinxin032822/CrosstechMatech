import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "../Styles/Contacts.css";

const schema = yup.object({
  fullname: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  message: yup.string().required("Message is required"),
});

function Contacts() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

    const onSubmit = (data) => {
    console.log("Contact Form Data:", data);
  };

  
  return (
    <div>
      <div className='contacts-header'>
        <p className='contacts-header-title'>Contact Us</p>
        <p className='contact-header-desc'>Get in touch with our team for inquiries about heavy equipment, <br /> support, or partnership opportunities.</p>
      </div>

      <div className="contacts-container">
        <div className="contact-form-section">
          <p className='SendUsMessageContactUsPage'>Send us a Message</p>
          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                {...register("fullname")}
                placeholder="Enter your full name"
              />
              {errors.fullname && <p className="error">{errors.fullname.message}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label>Message / Inquiry</label>
              <textarea
                {...register("message")}
                placeholder="Write your message here..."
                rows={4}
              />
              {errors.message && <p className="error">{errors.message.message}</p>}
            </div>

            <button type="submit" className="contact-submit-button">Send Message</button>
          </form>
        </div>
        <div className='contact-info-section'>
          <p className='GetInTouchContactUsPage'>Get in Touch</p>
          <div>
            <p>Address</p>
            <p>Door 59 Mimric Bldg. Sta. Ana Avenue 8000 Brgy. 27C Davao City, Davao City, Philippines</p>
          </div>
          <div>
            <p>Phone Number</p>
            <p>+63 925 777 4587</p>
          </div>
          <div>
            <p>Operating Hours</p>
            <p>Monday - Wednesday: 8:00am - 4:30pm</p>
            <p>Thursday: 8:00am - 4:00pm</p>
            <p>Friday - Saturday: 8:00am - 5:00pm</p>
          </div>
          <div>
            <p>Email</p>
            <p>dcantuba_08@yahoo.com</p>
          </div>
        </div>
      </div>

      {/* map */}
      <div>

      </div>
    </div>
  )
}

export default Contacts