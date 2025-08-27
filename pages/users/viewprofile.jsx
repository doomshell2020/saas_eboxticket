import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import styles from "@/styles/ViewProfilePage.module.css";

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

  if (!user) {
    return (
      <>
        <FrontendHeader />
        <div className={styles.loadingWrapper}>
          <p>Loading profile...</p>
        </div>
        <FrontendFooter />
      </>
    );
  }

  return (
    <>
      <FrontendHeader />
      <div className={styles.pageWrapper}>
        <section className={styles.profileSection}>
          <div className={styles.container}>
            <div className="heading">
              <h1>Profile</h1>
              <h2>My Profile</h2>
              <p>Your profile information is displayed below.</p>
            </div>

            <div className={styles.profileContent}>
              {/* Sidebar */}
              <div className={styles.sidebar}>
                <div className={styles.userProfile}>
                  <div className={styles.userAvatar}>
                    <img
                      src="https://eboxtickets.com/images/Usersprofile/noimage.jpg"
                      alt={user?.name || "User"}
                    />
                  </div>
                  <h5 className={styles.userName}>
                    {user?.name || "Guest User"}
                  </h5>
                  <Link href="/users/update-profile" className={styles.editLink}>
                    <i className="fas fa-edit"></i> Edit Profile
                  </Link>
                </div>
              </div>

              {/* Details */}
              <div className={styles.details}>
                <table className={styles.table}>
                  <tbody>
                    <tr>
                      <td>Email</td>
                      <td>{user?.email}</td>
                    </tr>
                    <tr>
                      <td>Registered On</td>
                      <td>Fri, 30th May 2025 04:47 AM</td>
                    </tr>
                    <tr>
                      <td>First Name</td>
                      <td>{user?.firstName || "-"}</td>
                    </tr>
                    <tr>
                      <td>Last Name</td>
                      <td>{user?.lastName || "-"}</td>
                    </tr>
                    <tr>
                      <td>Date of Birth</td>
                      <td>{user?.dob || "-"}</td>
                    </tr>
                    <tr>
                      <td>Gender</td>
                      <td>{user?.gender || "-"}</td>
                    </tr>
                    <tr>
                      <td>Phone Number</td>
                      <td>{user?.mobile || "-"}</td>
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
        </section>
      </div>
      <FrontendFooter />
    </>
  );
};

export default ProfilePage;
