import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const FrontendHeader = ({ backgroundImage, isStripeShowing = false }) => {

  const [headerBackgroundImg, setHeaderBackgroundImg] = useState(backgroundImage ?? "/assets/img/slider_bg9.jpg");

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // ✅ Check both storages for logged-in user
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUsername(userObj.name || "User");
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    // ✅ Clear both storages
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Optionally, you can call a backend logout API to clear cookies/session
    fetch("/api/logout", { method: "POST" }).catch(() => { });

    setIsLoggedIn(false);
    setShowDropdown(false);
    router.push("/login");
  };

  // ✅ Scroll effect for adding "scrolled" class
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".headernav");
      if (window.scrollY > 0) {
        header?.classList.add("scrolled");
      } else {
        header?.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="headernav">
        <div className="container">
          <div className="navflexbox">
            <Link href="/" className="logodiv">
              <img src="/logo.png" alt="Logo" className="headerlogo" />
            </Link>
            <div className="menuflexbox">
              <nav className="menulistbox">
                <Link href="/" className="navLink">Home</Link>
                <Link href="/calender" className="navLink">Event Calendar</Link>
                <Link href="/tickets/my-tickets" className="navLink">My Tickets</Link>
                <Link href="/cart" className="navLink">Cart<span class="position-absolute top-0 left-100 translate-middle badge rounded-pill bg-danger">2<span class="visually-hidden">unread messages</span>
                </span>
                </Link>
                <Link href="/contact-us" className="navLink">Contact Us</Link>
              </nav>

              <div className="userMenu">
                {isLoggedIn ? (
                  <>
                    <button
                      className="userwelcome-button primery-button"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      Welcome {username} ▾
                    </button>
                    {showDropdown && (
                      <ul className="header-dropdown">
                        <li><Link href="/event/myevent" className="dropdownLink active-des-link"><i className="fas fa-tachometer-alt"></i> Dashboard</Link></li>
                        <li><Link href="/users/viewprofile" className="dropdownLink"><i className="fas fa-user"></i> My Profile</Link></li>
                        <li><Link href="/tickets/my-tickets" className="dropdownLink"><i className="fas fa-ticket-alt"></i> My Tickets</Link></li>
                        <li><Link href="/event/my-event" className="dropdownLink"><i className="fas fa-calendar-alt"></i> My Events</Link></li>
                        <li><Link href="/users/employee" className="dropdownLink"><i className="fas fa-users"></i> My Staff</Link></li>
                        <li><Link href="/event/post-event" className="dropdownLink"><i className="fas fa-plus-circle"></i> Post Event</Link></li>
                        <li>
                          <button onClick={handleLogout} className="dropdownLink">
                            <i className="fas fa-sign-out-alt"></i> Logout
                          </button>
                        </li>
                      </ul>

                    )}
                  </>
                ) : (
                  <Link href="/login">
                    <button className="userloginbtn primery-button">Login / Register</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* all page whatsapp button */}
      <div className="whatsapp-icon">
        <a
          href="https://api.whatsapp.com/send?phone=+18687786837"
          className="pin_trest d-flex align-items-center justify-content-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {/* all page whatsapp button end*/}
      <div id="inner_slider">
        <img src={headerBackgroundImg} alt="slider" />
        <div className="inner_slider_contant">
          <div className="slider_Cheaper">
            {isStripeShowing && (
              <div className="cheaper_con">
                <p>Tickets are Cheaper Here (8%)</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default FrontendHeader;
