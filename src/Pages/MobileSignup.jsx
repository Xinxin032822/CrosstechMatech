import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/firebase.js';
import { useNavigate } from 'react-router-dom';
import eyeClosed from "../../public/assets/eye-close-svgrepo-com.svg";
import signupIllustration from "/assets/Login.gif";
import { motion } from 'framer-motion';
import "../Styles/MobileSignup.css";

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function MobileSignup() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(prev => !prev);

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log("User signed up:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="mobile-signup-container">
      <div className="mobile-signup-illustration" style={{backgroundColor: '#fff'}}>
        <img src={signupIllustration} alt="Signup illustration" className="gifSignupMobile" />
      </div>

      <motion.form 
        className="mobile-signup-form" 
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div>
            <div className="SignupMobileHeader">
          <h2 className="mobile-signup-title">Create Account</h2>
          <p className="mobile-signup-subtitle">Join us today!</p>
        </div>
        
        <div className="form-group-mobile-signup">
          <input
            type="text"
            {...register("name")}
            placeholder="Full Name"
            className="input-field-mobile-signup"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="form-group-mobile-signup">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="input-field-mobile-signup"
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-group-mobile-signup">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              className="input-field-mobile-signup"
            />
            <span className="toggle-password" onClick={togglePassword}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#888">
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 
                    5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 
                    1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
              ) : (
                <img src={eyeClosed} alt="Hide Password" width="20" height="20" />
              )}
            </span>
          </div>
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <button type="submit" className="signup-button-mobile">Create Account</button>
        </div>
      </motion.form>
    </div>
  );
}

export default MobileSignup;
