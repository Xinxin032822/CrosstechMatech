import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import "../Styles/Signup.css";

import { useNavigate } from 'react-router-dom';

import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../Component/Transition/pageTransition.js";

import { db } from '../Data/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { auth } from '../Data/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    termsAccepted: yup
    .boolean()
    .oneOf([true], "You must accept the terms and policies"),
});

function Signup() {
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        createdAt: new Date(),
        isAdmin: false
      });

      navigate('/');
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    }
  };


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });


  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
    
    className="SignupPageContainer">
      <div className="MainClassSignupPage">
        <div className="mainClassChilds">
          <h1 className="CrosstechMatechSignupPageHeader">Crosstech Matech</h1>
          <p className="CreateYourAccountSignupPage">Create your Account</p>
        </div>

        <form className="SignupForm" onSubmit={handleSubmit(onSubmit)}>

          
          <div className="FormGroup">
            <label className='LabelSignupPage'>Full Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your full name"
              className="InputField"
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          </div>


          <div className="FormGroup">
            <label className='LabelSignupPage'>Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              className="InputField"
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
          </div>


          <div className="FormGroup">
            <label className='LabelSignupPage'>Password</label>
            <input
              type="password"
              {...register("password")}
              placeholder="Create a password"
              className="InputField"
            />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          </div>


          <div className="CheckboxGroup">
            <input
              type="checkbox"
              {...register("termsAccepted")}
              className="CheckboxInput"
              id="termsCheckbox"
            />
            <label htmlFor="termsCheckbox" className="CheckboxLabel">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>, 
              <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>, and 
              <a href="/refund" target="_blank" rel="noopener noreferrer"> Refund Policy</a>.
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-600 text-sm">{errors.termsAccepted.message}</p>
          )}


          <button type="submit" className="SignupButton">Create Account</button>
        </form>

        <div className="CreateAccountLink">
          <div className="CreateAccountLinkDiv">
            <hr className="horizontalLine" />
            <p className="horizontalText">Already have an Account?</p>
            <hr className="horizontalLine" />
          </div>
          <Link to="/login" className="SignInLink">Sign in</Link>
        </div>

      </div>
    </motion.div>
  );
}

export default Signup;
