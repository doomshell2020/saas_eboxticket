import React, { useState, useRef, useEffect } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import FrontLeftSideBar from "@/shared/layout-components/frontelements/front-left-side-bar";
import Link from "next/link";
import axios from "axios";
import {
    CForm,
    CCol,
    CFormLabel,
    CFormFeedback,
    CFormInput,
    CInputGroupText,
    CButton,
    CFormCheck,
    CFormTextarea,
} from "@coreui/react";
import { Breadcrumb, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import moment from "moment-timezone";
import Swal from "sweetalert2";

const MyEventsPage = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isLeftRight, setIsLeftRight] = useState(false);
    const [isOpenWiggins, setIsOpenWiggins] = useState(false);
    console.log("isOpenWiggins", isOpenWiggins);
    // const [isLeftRightWiggins, setIsLeftRightWiggins] = useState(false);



    const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
    return (
        <>
            <FrontendHeader backgroundImage={backgroundImage} />
            {/* <FrontLeftSideBar /> */}

            <section id="myevent-deshbord">
                <div className="d-flex">

                    <div className={`event-sidebar ${isLeftRight ? 'sideBarRightLeftClosed' : ''}`}>
                        <div className="side_menu_icon">
                            <i className={`bi bi-arrow-${isLeftRight ? 'right' : 'left'}-short`} onClick={() => setIsLeftRight(!isLeftRight)}></i>
                        </div>
                        <ul className="listunstyl components2">
                            <li className="mb-3">
                                <Link className="text-white fw-bold"
                                    href="/event/post-event"
                                    style={{ backgroundColor: "#ff9800" }}
                                >
                                    <i className="bi bi-calendar2-event"></i>
                                    <span className="fw-bold"> Create Event </span>
                                </Link>
                            </li>
                            <li className="mb-3">
                                <Link className="text-white fw-bold"
                                    href="/event/post-event"
                                    style={{ backgroundColor: "#00ad00" }}
                                >
                                    <i className="bi bi-eye-fill"></i>
                                    <span className="fw-bold"> View Event </span>
                                </Link>
                            </li>
                        </ul>

                        <ul className="listunstyl components">
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-speedometer2"></i>
                                    <span> Dashboard </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-sliders"></i>
                                    <span> Settings </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-credit-card"></i>
                                    <span> Payments </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-bar-chart"></i>
                                    <span> Analytics </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-wallet2"></i>
                                    <span> Payouts </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-wallet2"></i>
                                    <span> Export Tickets </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-people"></i>
                                    <span> Committee </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="fas fa-ticket-alt"></i>
                                    <span>  Tickets </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/event/my-event">
                                    <i className="fas fa-chart-bar"></i>
                                    <span> Ticket Reports </span>
                                </Link>
                            </li>

                            <li className="menu_line"></li>

                            <li>
                                <ul className="dropdown-box ps-0">
                                    <li className="dropdown">
                                        <button
                                            className="dropdown-toggle w-100 bg-transparent border-0 shadow-none d-flex justify-content-between align-items-center"
                                            role="button"
                                            onClick={() => setIsOpen(!isOpen)}
                                            data-bs-toggle="dropdown"
                                        >
                                            <span> Account </span>
                                        </button>

                                        {isOpen && (
                                            <ul className="dropdown-munubox p-0 w-100 border-0">
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="/event/my-ticket"
                                                    >
                                                        <i className="fas fa-ticket-alt"></i>
                                                        <span> My Tickets </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="/"
                                                    >
                                                        <i className="bi bi-person"></i>
                                                        <span> Profile </span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        className="dropdown-item"
                                                        href="/"
                                                    >
                                                        <i className="bi bi-box-arrow-right"></i>
                                                        <span> Logout </span>
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                </ul>
                            </li>
                        </ul>


                    </div>
                    <div className="event-righcontent">
                        <div className="dsa_contant">
                            <section id="post-eventpg edit-event-page">
                                <div className="event_names d-flex justify-content-between align-items-center p-2 px-3 mb-3">
                                    <div className="dropdown">
                                        <button
                                            className="btn rounded-md text-sm text-white dropdown-toggle"
                                            role="button"
                                            id="dropdownMenuLink2"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={{ backgroundColor: "#e62d56" }}
                                            onClick={() => setIsOpenWiggins(!isOpenWiggins)}
                                        >
                                            Jescie Wiggins
                                        </button>
                                        {isOpenWiggins && (
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                <li>
                                                    <a className="dropdown-item" href="https://eboxtickets.com/event/settings/287">
                                                        Jescie Wiggins
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item" href="https://eboxtickets.com/event/settings/283">
                                                        Raksha Bandhan
                                                    </a>
                                                </li>
                                                <li>
                                                    <a className="dropdown-item browseall_event" href="https://eboxtickets.com/event/myevent">
                                                        Browse All Event
                                                    </a>
                                                </li>
                                            </ul>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h6 className="event_Heading mb-0 fs-5 fw-bold">Jescie Wiggins</h6>
                                    </div>

                                    <div className="text-right mt-1">
                                        <a
                                            href="https://eboxtickets.com/event/Velit-rerum-amet-ve"
                                            target="_blank"
                                            className="btn rounded-md text-sm text-white"
                                            rel="noopener noreferrer"
                                            style={{ backgroundColor: "#00b56a" }}
                                        >
                                            View Event
                                        </a>
                                    </div>
                                </div>
                                <div className="prosection">
                                    <div className="table-responsive">
                                        <div className="scroll_tab w-auto px-2">
                                            <ul id="progressbar">
                                                <li className="active"><Link className="fw-semibold" href="/event/event-detail/manage-event">Manage Event</Link></li>
                                                <li><Link className="fw-semibold" href="/event/event-detail/manage-tickets">Manage Tickets</Link></li>
                                                <li><Link className="fw-semibold" href="/event/event-detail/manage-committee">Manage Committee</Link></li>
                                                <li><Link className="fw-semibold" href="/event/event-detail/publish-event">Publish Event</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="text-24">Manage Event Settings </h4>
                                <hr className="custom-hr" />
                                <p className="text-14 text-dark">You can manage all your event settings here.</p>
                                <ul className="tabes d-flex ps-0">
                                    <li>
                                        <a href="#" className="active text-16">
                                            Settings
                                        </a>
                                    </li>
                                </ul>
                                <div className="contant_bg">
                                    <h6>Event Settings</h6>
                                    <form>

                                        <div className="resistor-content">
                                            <div className="row g-3">

                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Event Name <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Event Name" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Location <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Event Name" />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Company <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Company</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Country <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        URL Slug <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Share URL <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="text" className="form-control rounded-0" placeholder="Event Name" />
                                                </div>

                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Event Start:-(21-08-2025 05:00:00 AM) <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Event End:-(27-08-2025 12:00:00 AM) <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="datetime-local"
                                                        className="form-control rounded-0"
                                                        disabled
                                                    />
                                                </div>


                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Sale Start:-(21-08-2025 05:00:00 AM) <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Sale End:-(25-08-2025 05:00:00 AM) <span className="text-danger">*</span>
                                                    </label>
                                                    <input type="datetime-local" className="form-control rounded-0" />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Currency <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Ticket Limit per person <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">
                                                        Approval Expiry <span className="text-danger">*</span>
                                                    </label>
                                                    <select className="form-select rounded-0">
                                                        <option>Choose Country</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="formFile" className="form-label">
                                                        Preview Image{" "}
                                                        <a
                                                            href="#"
                                                            className="preview_img fw-normal"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#exampleModal"
                                                        >
                                                            Preview Image
                                                        </a>
                                                    </label>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label className="form-label">
                                                        Description <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea className="form-control rounded-0" rows="3"></textarea>
                                                </div>
                                                <div className="col-12 text-end">
                                                    <button type="submit" className="btn submit">
                                                        Next
                                                    </button>
                                                </div>

                                            </div>

                                        </div>

                                    </form>
                                </div>


                            </section>
                        </div>
                    </div>
                </div>
            </section>

            <FrontendFooter />

        </>
    )
}

export default MyEventsPage