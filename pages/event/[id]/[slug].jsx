import React, { useState } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import Link from "next/link";
import { format } from "date-fns";

export async function getServerSideProps({ params }) {
  const { id, slug } = params;
  try {
    const res = await fetch(`http://localhost:3000/api/v1/front/event/events/?key=front_event_details&id=${id}`);
    if (!res.ok) throw new Error("Failed to fetch event details");
    const { data } = await res.json();
    return {
      props: {
        event: data || null,
        slug,
      },
    };
  } catch (error) {
    console.error("Error fetching event detail:", error.message);
    return {
      props: {
        event: null,
        slug,
      },
    };
  }
}


const EventDetailPage = ({ event, slug }) => {

  // console.log('>>>>>>>>>', event, slug); 
  const startDate = (new Date(event.StartDate));
  const endDate = (new Date(event.EndDate));

  const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
  return (
    <>
      <FrontendHeader backgroundImage={backgroundImage} />

      <section id="event-detail-page">
        <div className="container">
          <div className="row">

            <div className="col-md-6">
              <div className="ticker_img fadeInLeft position-sticky top-0">
                <div className="ticker_imgmn">
                  {/* <img
                    src="/assets/front-images/event-section-img.jpg"
                    alt="img"
                  /> */}
                  <img
                    className="event_img"
                    src={`${process.env.NEXT_PUBLIC_S3_URL_NEW}/profiles/${event.ImageURL}`}
                    alt={event.EventName}
                  />
                </div>

                <img
                  className="event_bg position-absolute"
                  src="/assets/front-images/detals-bg.png"
                  alt="img"
                />

                <div className="social mt-4 d-flex social_bg justify-content-between align-items-center">
                  <h5 className="mb-0">Share With Friends</h5>
                  <ul className="list-inline social_ul m-0">
                    <li className="list-inline-item">
                      <Link
                        href="https://www.facebook.com/sharer.php?u=https://eboxtickets.com/event/South-Oropuche"
                        target="_blank"
                      >
                        <i className="fab fa-facebook-f"></i>
                      </Link>
                    </li>

                    <li className="list-inline-item">
                      <Link
                        href="https://twitter.com/share?url=https://eboxtickets.com/event/South-Oropuche&amp;text=Souldierz Games Night"
                        target="_blank"
                      >
                        <i className="fab fa-twitter"></i>
                      </Link>
                    </li>

                    <li className="list-inline-item">
                      <Link
                        href="mailto:?subject=Ebox Tickets: Souldierz Games Night&amp;body=Check out this event: https://eboxtickets.com/event/South-Oropuche&amp;title=Share by Email"
                        target="_blank"
                      >
                        <i className="fa fa-envelope"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
                
              </div>

            </div>

            <div className="col-md-6">
              <form action="">
                <div className="event-ticket-box">
                  <div className="section-heading">
                    <h2 className="text-start">{event?.Name || 'No Name'}</h2>
                    <h6>Hosted By <a href="#">Our Lady of Assumption </a></h6>
                  </div>

                  <div className="info">
                    <ul className="d-flex ps-0 mb-0">
                      <li className="flex-fill">
                        <div>
                          <h6>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 
                2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 
                2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5ZM1 4v10a1 1 0 
                0 0 1 1h12a1 1 0 0 0 1-1V4H1Z" />
                              <path d="M11 6h1v1h-1V6ZM3 8h2v2H3V8Zm3 0h2v2H6V8Zm3 
                0h2v2H9V8ZM3 11h2v2H3v-2Zm3 0h2v2H6v-2Zm3 
                0h2v2H9v-2Z" />
                            </svg> Start Date
                          </h6>
                          <span>
                            {format(startDate, "EEE, dd MMM yyyy | hh:mm a")}
                          </span>
                        </div>
                      </li>

                      <li className="flex-fill">
                        <div>
                          <h6>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M3.5 0a.5.5 0 0 
                                1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 
                                2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 
                                2-2h1V.5a.5.5 0 0 1 .5-.5ZM1 4v10a1 1 0 0 0 1 
                                1h12a1 1 0 0 0 1-1V4H1Z" />
                              <path d="M11 6h1v1h-1V6ZM3 8h2v2H3V8Zm3 0h2v2H6V8Zm3 
                                0h2v2H9V8ZM3 11h2v2H3v-2Zm3 0h2v2H6v-2Zm3 
                                0h2v2H9v-2Z" />
                            </svg> End Date
                          </h6>
                          <span>
                            {format(endDate, "EEE, dd MMM yyyy | hh:mm a")}
                          </span>
                        </div>
                      </li>

                      <li className="flex-fill">
                        <div>
                          <h6>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                              <path fillRule="evenodd" d="M8 16s6-5.686 6-10A6 
                6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 
                0-6 3 3 0 0 1 0 6" />
                            </svg> Location
                          </h6>
                          <span>
                            {event.Venue || event.Address || "Location not available"}
                          </span>
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
                      {/* Tickets */}
                      {event?.EventTicketTypes?.filter(ticket => {
                        const now = new Date();
                        const start = new Date(ticket.sale_start_date);
                        const end = new Date(ticket.sale_end_date);
                        return now >= start && now <= end; // Only show if within sale period
                      }).map(ticket => (
                        <li key={ticket.id} className="list-item-none">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-4 price-name">
                              <h6>{ticket.ticket_name}</h6>
                            </div>

                            <div className="col-sm-6 col-8 price-details">
                              <div className="row align-items-center">
                                <div className="col-6 d-flex align-items-center justify-content-end">
                                  <span className="price">
                                    {event?.Currency?.Currency_symbol}{ticket.price} {event?.Currency?.Currency}
                                  </span>
                                </div>
                                <div className="col-6">
                                  <select className="form-select">
                                    {Array.from({ length: 11 }, (_, i) => (
                                      <option key={i} value={i}>{i}</option> // 0 - 10
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}

                      {/* Addons */}
                      {event?.Addons?.filter(addon => {
                        const now = new Date();
                        const start = new Date(addon.sale_start_date);
                        const end = new Date(addon.sale_end_date);
                        return now >= start && now <= end;
                      }).map(addon => (
                        <li key={addon.id} className="list-item-none">
                          <div className="row align-items-center">
                            <div className="col-sm-6 col-4 price-name">
                              <h6>{addon.name}</h6>
                            </div>

                            <div className="col-sm-6 col-8 price-details">
                              <div className="row align-items-center">
                                <div className="col-6 d-flex align-items-center justify-content-end">
                                  <span className="price">
                                    {event?.Currency?.Currency_symbol}{addon.price} {event?.Currency?.Currency}
                                  </span>
                                </div>
                                <div className="col-6">
                                  <select className="form-select">
                                    {Array.from({ length: 11 }, (_, i) => (
                                      <option key={i} value={i}>{i}</option> // 0 - 10
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div className="form-group ticket_all">
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
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div> */}

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
                    {event?.Summary && (
                      <div
                        dangerouslySetInnerHTML={{ __html: event.Summary }}
                      />
                    )}

                    <p className="mb-0">
                      <i><b>Note: An 8% transaction fee is applicable with each purchase.</b></i>
                    </p>
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

export default EventDetailPage;
