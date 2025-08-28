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


    return (
        <>
            <FrontendHeader />
            {/* <FrontLeftSideBar /> */}

            <section id="myevent-deshbord">
                <div className="d-flex">
                    <div className="event-sidebar">
                        <div className="side_menu_icon">
                            <i className="bi bi-arrow-left-short"></i>
                        </div>
                        <ul className="listunstyl components2">
                            <li className="mb-3">
                                <a className="text-white fw-bold"
                                    href="https://eboxtickets.com/event/postevent"
                                    style={{ backgroundColor: "#ff9800" }}
                                >
                                    <i className="bi bi-calendar2-event"></i>
                                    <span className="fw-bold"> Create Event </span>
                                </a>
                            </li>
                        </ul>

                        <ul className="listunstyl components">
                            <li>
                                <a href="https://eboxtickets.com/event/myevent">
                                    <i className="bi bi-speedometer2"></i>
                                    <span> Dashboard </span>
                                </a>
                            </li>

                            <li className="menu_line"></li>

                            <li>
                                <nav className="navbar navbar-expand-lg navbar-dark sidmenub w-100">
                                    <div className="collapse navbar-collapse">
                                        <ul className="navbar-nav">
                                            <li className="nav-item dropdown">
                                                <a
                                                    className="nav-link dropdown-toggle"
                                                    href="#"
                                                    role="button"
                                                    data-bs-toggle="dropdown"
                                                >
                                                    <span> Account </span>
                                                </a>
                                                <ul className="dropdown-menu dropdown-menu-dark p-0 w-100 border-0">
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="https://eboxtickets.com/tickets/myticket"
                                                        >
                                                            <i className="bi bi-ticket-perforated"></i>
                                                            <span> My Tickets </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="https://eboxtickets.com/users/viewprofile"
                                                        >
                                                            <i className="bi bi-person"></i>
                                                            <span> Profile </span>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="https://eboxtickets.com/logins/frontlogout"
                                                        >
                                                            <i className="bi bi-box-arrow-right"></i>
                                                            <span> Logout </span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                </nav>
                            </li>
                        </ul>


                    </div>
                </div>
            </section>

            <FrontendFooter />

        </>
    )
}

export default MyEventsPage