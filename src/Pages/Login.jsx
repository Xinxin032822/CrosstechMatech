import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "../Styles/Login.css";
import eyeClosed from "../assets/eye-close-svgrepo-com.svg";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Data/firebase.js";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});


function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

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
    <div className='MainBodyLoginPage'>
      <div className="MainClassLoginPage">
        <div className="MainLoginPageHeader">
          <p className="WelcomeBackTextMainLogin">Welcome Back</p>
          <p className="signInToYourAccount">Sign in to your Account</p>
        </div>

        <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="FormGroup">
            <label className='LoginPageLabel'>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="InputField"
            />
            {errors.email && <p className="text-red-600 text-sm errorMessageFormLogin">{errors.email.message}</p>}
          </div>

          <div className="FormGroup">
            <label className='LoginPageLabel'>Password</label>
            <div className="PasswordWrapper">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className="InputField"
              />
              <span className="TogglePasswordIcon" onClick={togglePassword}>
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#888">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 
                    5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 
                    1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                ) : (
                  <img src={eyeClosed} alt="Hide Password" width="20" height="20" className='ImageHidePasswordCloseEye' />
                )}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-sm errorMessageFormLogin">{errors.password.message}</p>}
          </div>

          <div className="FormGroup">
            <Link to="/forgot-password" className="ForgotLink">Forgot Password?</Link>
          </div>

          <button type="submit" className="LoginButton">Sign In</button>
        </form>

        <div className="CreateAccountLink">
          <div className="CreateAccountLinkDiv flex items-center gap-4 my-6">
            <hr className="horizontalLine" />
            <p className="text-gray-600 whitespace-nowrap">Don't have an Account?</p>
            <hr className="horizontalLine" />
          </div>
          <Link to="/signup" className="text-red-600 font-semibold">Create a new Account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
