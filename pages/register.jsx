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

  return (
    <>
      <FrontendHeader />
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
              <img src="https://eboxtickets.com/images/sigin.png" alt="" />
          </div>

          <div className="col-md-6 col-sm-12 sig_img">
          <div className={styles.rightSide}>
                <h1>Create Account</h1>
                <p>Fill in the details below to register.</p>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div className={styles.checkbox}>
                    <span>Gender: </span>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        required
                      />{" "}
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                      />{" "}
                      Female
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        value="other"
                        checked={formData.gender === "other"}
                        onChange={handleChange}
                      />{" "}
                      Other
                    </label>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className={styles.loginButton}>
                    Register
                  </button>

                  <p className={styles.signupText}>
                    Already have an account? <Link href="/login">Login</Link>
                  </p>
                </form>
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
