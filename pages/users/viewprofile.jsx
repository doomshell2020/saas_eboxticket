import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import { name } from "@/shared/data/switcher/Switcherdata";


const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!savedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',user);

  const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
  return (
    <>
      <FrontendHeader backgroundImage={backgroundImage} />
      <section id="profile" className="mt-5 mb-5">
        <div className="container">
          <div className="section-heading">
            <h1>Profile</h1>
            <h2 className="mt-4">My Profile</h2>
            <p className="mb-4 body-text text-center">Your profile information is displayed below.</p>
          </div>

          <div className="profil_deaile mx-auto">
            <div className="row">
              <div className="col-md-3">
                <div className="user-profile text-center">
                  <div className="user-avatar ">
                    <img className="mx-auto text-center"
                      src="/assets/front-images/noimage.jpg"
                      alt="Maxwell Admin"
                    />
                  </div>
                  <h5 className="user-name text-center text-16 my-3">{user?.name}</h5>
                  <Link
                    className=" primery-button text-14 fw-normal " href="/"
                  >
                    <i className="fas fa-edit"></i> Edit Profile
                  </Link>
                </div>
              </div>

              <div className="col-md-9">
                <div className="profile-details p-4 mx-auto">
                  <table className="table mb-0 border-0">
                    <tbody>
                      <tr>
                        <td className="border-top-0">Email</td>
                        <td className="border-top-0">{user?.email}</td>
                      </tr>
                      <tr>
                        <td>Registered On</td>
                        <td>Fri, 30th May 2025 04:47 AM</td>
                      </tr>
                      <tr>
                        <td>Name</td>
                        <td>{user?.name}</td>
                      </tr>                      
                      <tr>
                        <td>Date of Birth</td>
                        <td>01-01-2000</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>Male</td>
                      </tr>
                      <tr>
                        <td>Phone Number</td>
                        <td>
                          <button
                            type="button"
                            className="btn verified_btn p-0"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Verified"
                          >
                            <i className="bi bi-patch-check-fill"></i>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Email Related Events</td>
                        <td>Yes</td>
                      </tr>
                      <tr>
                        <td>Email Newsletter</td>
                        <td>Yes</td>
                      </tr>
                    </tbody>
                  </table>
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

export default ProfilePage;
