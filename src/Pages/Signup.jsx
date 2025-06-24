import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import "../Styles/Signup.css";

const schema = yup.object({
  name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  agree: yup.bool().oneOf([true], "You must agree to the Terms and Services"),
});

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Signup data:", data);
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="MainClassSignupPage">
        <div className="mainClassChilds">
          <p className="CrosstechMatechSignupPageHeader">Crosstech Matech</p>
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

          <label className="CustomCheckbox">
            <input type="checkbox" {...register("agree")} />
            <span className="checkmark"></span>
            I agree to the <a href="#">Terms & Services</a>
          </label>
          {errors.agree && <p className="text-red-600 text-sm">{errors.agree.message}</p>}
          
          <button type="submit" className="SignupButton">Create Account</button>
        </form>

        <div className="CreateAccountLink">
          <div className="CreateAccountLinkDiv">
            <hr className="horizontalLine" />
            <p className="horizontalText">Already have an Account?</p>
            <hr className="horizontalLine" />
          </div>
          <Link to="/login" className="SignInLink">Sign in to your Account</Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;
