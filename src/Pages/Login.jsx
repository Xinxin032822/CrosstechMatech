import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "../Styles/Login.css";
import eyeClosed from "../assets/eye-close-svgrepo-com.svg";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  const onSubmit = (data) => {
    console.log("Login data:", data);
  };

  return (
    <div className="MainClassLoginPage">
      <div className="MainLoginPageHeader">
        <p className="text-2xl font-bold">Welcome Back</p>
        <p className="text-lg text-gray-600">Sign in to your Account</p>
      </div>

      <form className="LoginForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="FormGroup">
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="InputField"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        <div className="FormGroup">
          <label>Password</label>
          <div className="PasswordWrapper">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Enter your password"
              className="InputField"
            />
            <span className="TogglePasswordIcon" onClick={togglePassword}>
              {showPassword ? (
                // 👁️ Eye Open Icon
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
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        <div className="FormGroup">
          <Link to="/forgot-password" className="ForgotLink">Forgot Password?</Link>
        </div>

        <button type="submit" className="LoginButton">Sign In</button>
      </form>

      <div className="CreateAccountLink">
        <p>Don't have an Account?</p>
        <Link to="/signup" className="text-red-600 font-semibold">Create a new Account</Link>
      </div>
    </div>
  );
}

export default Login;
