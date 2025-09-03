import React, { useState } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import styles from "@/styles/LoginPage.module.css"; // using the same CSS
import Link from "next/link";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Call your registration API here
  };

  const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
  return (
    <>
      <FrontendHeader backgroundImage={backgroundImage} />
      <section id="sign-up">
        <div className="container">
          <div className="section-heading">
            <h1>Create Account</h1>
            <h2>Register</h2>
            <p className="text-center body-text">Enter your information below to create your account</p>
          </div>

          <div className="form-content">
            <div className="row">
              <div className="col-md-6 col-sm-12 sig_img">
                <img src="/assets/front-images/sigin.png" alt="img" />
              </div>

              <div className="col-md-6 col-sm-12 sig_img">
                <div className="contact-form">
                  <h1 className="fw-bold">Create Account</h1>
                  <p className="body-text">Fill in the details below to register.</p>

                  <form className="signup-pageform" onSubmit={handleSubmit}>
                    <div>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="first name"
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder=" last name"
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder=" email"
                        className="form-control"
                        required
                      />
                    </div>

                    <div>
                      <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder=" password"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="row align-items-center">
                      <label className="col-sm-3 col-form-label">Gender</label>
                      <div className="col-sm-9 d-flex">
                        <input className="ms-1" type="radio" name="gender" value="male" />
                        <label className="col-form-label ms-1">Male</label>

                        <input className="ms-1" type="radio" name="gender" value="female" />
                        <label className="col-form-label ms-1">Female</label>
                      </div>
                    </div>


                    <div className="row align-items-center">
                      <label className="col-sm-3 col-form-label">Date of Birth</label>
                      <div className="col-sm-9">
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          required
                        />
                      </div>
                    </div>

                    <div className="form_checkb gap-2 d-flex align-items-start">
                      <input className="mt-1" type="checkbox" name="termscheck" required />
                      <p className="chack_cont">By Creating An Account You Agree To Our <span><a target="_blank" href="https://eboxtickets.com/pages/privacy-policy">
                        Privacy Policy </a> </span>
                        and Accept Our
                        <span> <a target="_blank" href="https://eboxtickets.com/pages/terms-and-conditions">Terms and Conditions</a> </span>
                        .
                      </p>
                    </div>


                    <button type="submit" className="primery-button w-100 text-14 mt-3">
                      Register
                    </button>
                  </form>
                  <hr style={{ borderColor: "currentColor" }} />
                  <div className="reg_btn text-center">
                    <p className="text-14">
                      Already have an account?
                      <a className="rg fw-bold" href="login"> Log in</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <FrontendFooter />
    </>
  );
};

export default RegisterPage;
