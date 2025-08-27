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

  return (
    <>
      <FrontendHeader />
      <div className="heading">
        <h1>Profile</h1>
        <h2>My Profile</h2>
        <p>Your profile information is displayed below.</p>
      </div>
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.leftSide}>
            <img
              src="https://eboxtickets.com/images/sigin.png"
              alt="Login Illustration"
              className={styles.illustration}
            />
          </div>

          <div className={styles.rightSide}>
            <h1>Login</h1>
            <p>Welcome back! Please login to your account.</p>

            {error && <h5 className={styles.error}>{error}</h5>}
            {success && <h5 className={styles.success}>{success}</h5>}

            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>

              <button type="submit" className={styles.loginButton} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p className={styles.signupText}>
                Don't have an account? <Link href="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      <FrontendFooter />
    </>
  );
};

export default LoginPage;
