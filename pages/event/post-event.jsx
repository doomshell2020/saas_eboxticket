import React, { useState } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import Link from "next/link";

const EventDetailsPage = ({ events }) => {
    const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
    return (
        <>
            <FrontendHeader backgroundImage={backgroundImage} />

            <section id="post-eventpg" className="my-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-between post-event-topprt align-items-center">
                                <div className="top_h w-100">
                                    <p className="des_h mb-0">Post Event</p>
                                </div>
                                <ul className="list-inline text-right">
                                    <li className="list-inline-item">
                                        <Link className="primery-button text-14" href="/event/my-event">
                                            View Event
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="form-deta bg-white mt-3 mb-4 pb-3 rounded custom-shadow">
                                <h2 className="text-16 text-white text-uppercase position-relative text-start fw-bold"><i className="far fa-calendar-plus"></i>Post Event</h2>
                                <div className="inner-formdeta p-4 text-start fs-6 fw-normal">
                                    <div className="table-responsive">
                                        <div className="scroll_tab w-auto px-2">
                                            <ul id="progressbar">
                                                <li className="active"><a className="fw-bold" href="#">Post Event</a></li>
                                                <li><a className="fw-bold" href="#">Event Details</a></li>
                                                <li><a className="fw-bold" href="#">Manage Tickets</a></li>
                                                <li><a className="fw-bold" href="#">Publish Event</a></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <form>
                                        <h4 className="fw-bold">Event Info</h4>
                                        <div className="resistor-content">
                                            <div className="row g-3">
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Company <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="d-flex gap-2">
                                                        <select className="form-select rounded-0">
                                                            <option>Choose Company</option>
                                                        </select>
                                                        <button type="button" className="btn btn-primary rounded-0">Add</button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Event Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Event Name" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Country <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Location <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Location" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Upload Image <span className="text-danger" style={{ fontSize: "12px" }}>(Size 550*550) JPG, JPEG, PNG</span>
                                                    </label>
                                                    <input type="file" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0 d-flex align-items-end">
                                                    <div className="d-flex align-items-center justify-content-between w-100">
                                                        <div className="btn freeEventCheck orange d-flex align-items-center w-50 text-white">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input me-2"
                                                                id="is_free"
                                                            />
                                                            <label htmlFor="is_free" className="mb-0 text-14 text-white">
                                                                This Event is FREE
                                                            </label>
                                                        </div>
                                                        <div className="btn freeEventCheck green d-flex align-items-center w-50">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input me-2"
                                                                id="allow_register"
                                                            />
                                                            <label htmlFor="allow_register" className="mb-0 text-14 text-white">
                                                                Allow Registration
                                                            </label>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">Currency</label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Payment Type</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Event Start <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Event End <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Sale Start <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Sale End <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Ticket Limit per person <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Limit</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        URL Slug <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Slug" />
                                                    <label className="form-label">
                                                        Share URL <span >https://eboxtickets.com/event/</span>
                                                    </label>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">
                                                        Approval Expiry <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Days</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-4 col-md-6 col-sm-12 col-12 mb-3 mt-0">
                                                    <label className="form-label">Youtube URL</label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Youtube URL" />
                                                </div>
                                                <div className="col-12">
                                                    <label className="form-label">
                                                        Description <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea rows="5" className="form-control rounded-0" placeholder="Compose message..."></textarea>
                                                </div>
                                            </div>

                                        </div>

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

export default EventDetailsPage;