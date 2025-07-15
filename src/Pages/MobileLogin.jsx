import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Data/firebase.js';
import { useNavigate } from 'react-router-dom';
import eyeClosed from "../../public/assets/eye-close-svgrepo-com.svg";
import loginIllustration from "../../public/assets/login.gif"; // Add your own SVG or image

import "../Styles/MobileLogin.css";

const schema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function MobileLogin() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      console.log("User logged in:", userCredential.user);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error.message);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="mobile-login-container">
      <div className="mobile-login-illustration">
        <img src={loginIllustration} alt="Login illustration" className='gifLoginMobile' />
      </div>


      <form className="mobile-login-form" onSubmit={handleSubmit(onSubmit)}>
        
        <div className='LoginMobileHeader'>
            <h2 className="mobile-login-title">Login</h2>
        </div>
        <div>
            <div className="form-group-mobile-login">
          <input
            type="email"
            {...register("email")}
            placeholder="Username"
            className="input-field-mobile-login"
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-group-mobile-login">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              className="input-field-mobile-login"
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

        <button type="submit" className="login-button-mobile">Sign In</button>
        </div>
      </form>
    </div>
  );
}

export default MobileLogin;
