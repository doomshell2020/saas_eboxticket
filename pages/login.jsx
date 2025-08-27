import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import styles from "@/styles/LoginPage.module.css";
import Link from "next/link";
import toast from "react-hot-toast";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const rememberFlag = localStorage.getItem("rememberMe") === "true";
    setRememberMe(rememberFlag);

    if (rememberFlag) {
      const savedCredentials = JSON.parse(localStorage.getItem("loginCredentials") || "{}");
      if (savedCredentials.email) setEmail(savedCredentials.email);
      if (savedCredentials.password) setPassword(savedCredentials.password);
    }

    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (savedUser) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const loginPromise = fetch("/api/v1/front/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
        return data;
      });

    toast.promise(
      loginPromise,
      {
        loading: "Logging in...",
        success: (data) => data.message || "Login successful!",
        error: (err) => err.message || "Something went wrong!",
      }
    );

    try {
      const data = await loginPromise;

      setSuccess(data.message);

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem(
          "loginCredentials",
          JSON.stringify({ email, password })
        );
      } else {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("loginCredentials");
      }

      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [backgroundImage, setIsMobile] = useState('https://eboxtickets.com/images/about-slider_bg.jpg');
  return (
    <>
      <FrontendHeader backgroundImage={backgroundImage} />
      <section id="sign-up">
        <div className="container">
          <div className="section-heading">
            <h1>Login</h1>
            <h2>Login</h2>
            <p className="text-center body-text">Existing users use the form below to sign in.</p>
          </div>

          <div className="form-content">
            <div className="row align-items-center">
              <div className="col-md-6 col-sm-12 sig_img">
                <img src="https://eboxtickets.com/images/sigin.png" alt="Login Illustration" /></div>

              <div className="col-md-6 col-sm-12 sig_img">
                <div className="contact-form">
                  <h1 className="fw-bold">Login</h1>
                  <p className="body-text">Welcome back! Please login to your account.</p>

                  <form className="signup-pageform" onSubmit={handleSubmit}>

                    <div>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder=" password"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="row justify-content-between">
                      <div className="col-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            name="remember_me"
                          />
                          <label className="form-check-label text-14" htmlFor="rememberMe">
                            Remember Me
                          </label>
                        </div>
                      </div>

                      <div className="col-6 text-end">
                        <a href="users/forgotcpassword" className="for_pass fw-bold">
                          Forgot your password?
                        </a>
                      </div>
                    </div>



                    <button type="submit" className="primery-button w-100 text-14 mt-3">
                      Login
                    </button>
                  </form>
                  <hr style={{ borderColor: "currentColor" }} />
                  <div className="reg_btn text-center">
                    <p className="text-14">
                      Don't have an account? <Link className="rg fw-bold" href="/register">Sign up</Link>
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

export default LoginPage;
