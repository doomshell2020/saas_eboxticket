import React, { useState } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import Link from "next/link";

const EventDetailsPage = ({ events }) => {
  const [backgroundImage, setIsMobile] = useState('https://eboxtickets.com/images/about-slider_bg.jpg');
  return (
    <>
      <FrontendHeader backgroundImage={backgroundImage} />
      <section id="event-detail-page">
        <div className="container">
          <div className="row">

            <div className="col-md-6">
              <div className="ticker_img fadeInLeft position-sticky top-0">
                <div className="ticker_imgmn">
                  <img
                    src="https://eboxtickets.com/images/eventimages/1754935170691fc25ef906cdff43f13737b663b284.jpg"
                    alt="img"
                  />
                </div>

                <img
                  className="event_bg position-absolute"
                  src="https://eboxtickets.com/images/detals-bg.png"
                  alt="img"
                />

                <div className="social mt-4 d-flex social_bg justify-content-between align-items-center">
                  <h5 className="mb-0">Share With Friends</h5>
                  <ul className="list-inline social_ul m-0">
                    <li className="list-inline-item">
                      <a
                        href="https://www.facebook.com/sharer.php?u=https://eboxtickets.com/event/South-Oropuche"
                        target="_blank"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </a>
                    </li>

                    <li className="list-inline-item">
                      <a
                        href="https://twitter.com/share?url=https://eboxtickets.com/event/South-Oropuche&amp;text=Souldierz Games Night"
                        target="_blank"
                      >
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>

                    <li className="list-inline-item">
                      <a
                        href="mailto:?subject=Ebox Tickets: Souldierz Games Night&amp;body=Check out this event: https://eboxtickets.com/event/South-Oropuche&amp;title=Share by Email"
                        target="_blank"
                      >
                        <i className="fa fa-envelope"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="col-md-6">
              <form action="">
                <div className="event-ticket-box">
                  <div className="section-heading">
                    <h2 className="text-start">Souldierz Games Night</h2>
                    <h6>Hosted By <a href="#">Our Lady of Assumption </a></h6>
                  </div>
                  <div className="info">
                    <ul className="d-flex ps-0 mb-0">
                      <li className="flex-fill">
                        <div>
                          <h6>
                            <i className="fa-solid fa-calendar-days"></i> Start Date
                          </h6>
                          <span>
                            Sun, 24th Aug 2025 | 06:00 PM
                          </span>
                        </div>
                      </li>
                      <li className="flex-fill">
                        <div>
                          <h6>
                            <i className="fa-solid fa-calendar-days"></i> End Date
                          </h6>
                          <span>
                            Sun, 24th Aug 2025 | 09:00 PM
                          </span>
                        </div>
                      </li>
                      <li className="flex-fill">
                        <div>
                          <h6>
                            <i className="fa-solid fa-location-dot"></i> Location
                          </h6>
                          <span>South Oropouche R.C. School</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <h5 className="event_Sub_h">Tickets</h5>
                  <p className="event_pra">
                    The maximum number of tickets one account is allowed to purchase is 50.
                    You have <span className="tickets-left">50</span> more tickets left.
                  </p>
                  <p className="alert alert-danger">
                    You are only allowed 50 tickets for this event. You have no tickets left.
                  </p>
                  <div className="form-group ticket_all">
                    <ul className="ps-0">
                      <li className="list-item-none">
                        <div className="row align-items-center">
                          <div className="col-sm-6 col-4 price-name">
                            <h6>Souldierz Youth Ministry Games Night</h6>
                          </div>

                          <div className="col-sm-6 col-8 price-details">
                            <div className="row align-items-center ">
                              <div className="col-6 d-flex align-items-center justify-content-end">
                                <span className="price">$20.00 TTD</span>
                              </div>
                              <div className="col-6">
                                <select name="" id="" className="form-select">
                                  <option value="0">0</option>
                                  <option value="1">1</option>
                                  <option value="2">2</option>
                                  <option value="3">3</option>
                                  <option value="4">4</option>
                                  <option value="5">5</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="view_btn">
                    <a
                      id="register_login"
                      className="nav-link primery-button"
                      href="https://eboxtickets.com/login"
                      style={{ display: "none" }}
                    >
                      <span className="te_btn">Login / Register</span>
                    </a>
                  </div>
                  <h5 className="event_Sub_h">Description</h5>
                  <div className="event_desp">
                    <p>ACCA in collaboration with ICAC and PAOs from across the region, presents </p>
                    <p>ACCA in collaboration with ICAC and PAOs from across the region, presents <b> IFRS Update 2025 - 'Navigating Evolving Standards and Sustainability Imperatives'.</b> This two-day webinar will equip you with the insights, tools, and foresight needed to stay compliant, competitive, and impactful—helping you not only meet new requirements, but also lead in building a more transparent and sustainable future. </p>
                    <p className="mb-0"><i><b>Note:An 8% transaction fee is applicable with each purchase.</b></i></p>
                  </div>
                  <hr style={{ margin: "10px 0px", borderColor: "rgba(0,0,0,0.1)" }} />

                </div>
              </form>
            </div>

          </div>
        </div>
      </section>


      <FrontendFooter />
    </>
  );
};

export default EventDetailsPage;
