import React, { useMemo, useState, useRef, useEffect } from "react";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";
import FrontLeftSideBar from "@/shared/layout-components/frontelements/front-left-side-bar";
import Link from "next/link";
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
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import { format } from "date-fns"; // helps format dates



export default function OrganizerEvents({ userId }) {
    const [data, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLeftRight, setIsLeftRight] = useState(false);
    const [backgroundImage, setIsMobile] = useState('/assets/front-images/about-slider_bg.jpg');
    // console.log('>>>>>>>>>', data);

    useEffect(() => {
        // Fetch events by organizer
        const fetchEvents = async () => {
            try {
                const res = await axios.get(`/api/v3/front/events?userId=6`);
                if (res.data.success) {
                    setData(res.data.data || []);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchEvents();
    }, [userId]);


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
                        </ul>

                        <ul className="listunstyl components">
                            <li>
                                <Link href="/event/my-event">
                                    <i className="bi bi-speedometer2"></i>
                                    <span> Dashboard </span>
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
                        <h4>My Events</h4>
                        <hr
                            style={{
                                borderColor: "currentColor",
                            }}
                        />

                        <div className="search_sec">
                            <form className="d-flex align-items-center">
                                <input
                                    className="form-control me-2 text-14"
                                    style={{ height: "34px" }}
                                    type="text"
                                    placeholder="Search My Events"
                                    aria-label="Search"
                                />
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 17 18"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g fill="#2874F1" fillRule="evenodd">
                                        <path d="M11.618 9.897l4.225 4.212c.092.092.101.232.02.313l-1.465 1.46c-.081.081-.221.072-.314-.02l-4.216-4.203" />
                                        <path d="M6.486 10.901c-2.42 0-4.381-1.956-4.381-4.368 0-2.413 1.961-4.369 4.381-4.369 2.42 0 4.381 1.956 4.381 4.369 0 2.413-1.961 4.368-4.381 4.368m0-10.835c-3.582 0-6.486 2.895-6.486 6.467 0 3.572 2.904 6.467 6.486 6.467 3.582 0 6.486-2.895 6.486-6.467 0-3.572-2.904-6.467-6.486-6.467" />
                                    </g>
                                </svg>
                            </form>
                        </div>


                        <div className="desbord-content">
                            <div className="my-ticket-box">
                                <div className="event-list">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-dark table_bg">
                                                <tr>
                                                    <th style={{ width: "2%" }} scope="col">#</th>
                                                    <th style={{ width: "14%" }} scope="col">Name</th>
                                                    {/* <th style={{ width: "17%" }} scope="col">Date and Time</th> */}
                                                    <th style={{ width: "8%" }} scope="col">Venue</th>
                                                    <th style={{ width: "18%" }} scope="col">Ticket Sale</th>
                                                    <th style={{ width: "16%" }} scope="col">Ticket Types</th>
                                                    <th style={{ width: "15%" }} scope="col">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data && data.map((event, index) => {
                                                    const startDate = new Date(event.StartDate);
                                                    const endDate = new Date(event.EndDate);
                                                    const ticketTypes = Array.isArray(event?.EventTicketTypes) ? event.EventTicketTypes : [];
                                                    const currencySymbol = event?.Currency?.Currency_symbol || ""

                                                    return (
                                                        <tr>
                                                            <th scope="row">{index + 1}</th>
                                                            <td>
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_S3_URL_NEW}/profiles/${event.ImageURL}`}
                                                                    alt="Not Found"
                                                                />
                                                                <Link href="/">{event.Name}</Link>
                                                            </td>
                                                            <td>{event.Venue}</td>
                                                            <td>
                                                                <b>From</b> {format(startDate, "EEE, dd MMM yyyy")}
                                                                <br />
                                                                <b>To</b> {format(endDate, "EEE, dd MMM yyyy")}
                                                            </td>

                                                            <td className="ticket_types">
                                                                {ticketTypes && ticketTypes.length > 0 ? (
                                                                    ticketTypes.map((ticketType) => (
                                                                        <div key={ticketType.id} className="mb-3 p-2 border rounded bg-light">
                                                                            <p className="mb-1 fw-bold">
                                                                                {ticketType.title} –{" "}
                                                                                <span className="text-primary">
                                                                                    {currencySymbol || ""}{ticketType.price}
                                                                                </span>
                                                                            </p>
                                                                            <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                                                                                <div>
                                                                                    <b>Sale From:</b>{" "}
                                                                                    {ticketType.sale_start_date
                                                                                        ? format(new Date(ticketType.sale_start_date), "dd MMM yyyy")
                                                                                        : "N/A"}
                                                                                </div>
                                                                                <div>
                                                                                    <b>To:</b>{" "}
                                                                                    {ticketType.sale_end_date
                                                                                        ? format(new Date(ticketType.sale_end_date), "dd MMM yyyy")
                                                                                        : "N/A"}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p>Tickets not created</p>
                                                                )}
                                                            </td>

                                                            <td className="Con_center">
                                                                <div className=" editIcos">
                                                                    <Link href="/" className="edit viewIcos">
                                                                        <i className="bi bi-eye-fill"></i> View
                                                                    </Link>

                                                                    <Link href="/" className="edit viewIcos">
                                                                        <i className="fas fa-edit"></i> Edit
                                                                    </Link>

                                                                    <Link href="/" className="edit deleteIcos">
                                                                        <button type="button" className="edit p-0 m-0">
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="18"
                                                                                height="18"
                                                                                fill="#fff"
                                                                                className="bi bi-trash"
                                                                                viewBox="0 0 16 16"
                                                                            >
                                                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                                ></path>
                                                                            </svg>{" "}
                                                                            Delete
                                                                        </button>
                                                                    </Link>
                                                                </div>

                                                                <div className="d-flex">
                                                                    <Link className="action_btn enable_btn edit" href="/">
                                                                        <i className="bi bi-check-circle-fill"></i>
                                                                    </Link>

                                                                    <Link className="action_btn excel_btn edit" href="/">
                                                                        <img
                                                                            className="del-icon"
                                                                            style={{ width: "16px" }}
                                                                            src="/assets/front-images/export-icon.png"
                                                                            alt=""
                                                                        />
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                )}


                                                {/* <tr>
                                                    <th scope="row">2</th>
                                                    <td>
                                                        <img
                                                            src="/assets/front-images/my-event-section2.jpg"
                                                            alt="Not Found"
                                                        />
                                                        <Link href="/">Raksha Bandhan</Link>
                                                    </td>

                                                    <td>
                                                        <b>From</b> 08 Aug, 2025 12:00 PM
                                                        <br />
                                                        <b>To</b> 30 Aug, 2025 05:00 AM
                                                    </td>
                                                    <td>
                                                        <b>From</b> 08 Aug, 2025 12:00 PM
                                                        <br />
                                                        <b>To</b> 30 Aug, 2025 04:00 AM
                                                    </td>
                                                    <td>Jaipur</td>

                                                    <td className="ticket_types">
                                                        <p>Tickets not created</p>
                                                    </td>

                                                    <td className="Con_center">
                                                        <div className=" editIcos">
                                                            <Link href="/" className="edit viewIcos">
                                                                <i className="bi bi-eye-fill"></i> View
                                                            </Link>

                                                            <Link href="/" className="edit viewIcos">
                                                                <i className="fas fa-edit"></i> Edit
                                                            </Link>

                                                            <Link href="/" className="edit deleteIcos">
                                                                <button type="button" className="edit p-0 m-0">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="18"
                                                                        height="18"
                                                                        fill="#fff"
                                                                        className="bi bi-trash"
                                                                        viewBox="0 0 16 16"
                                                                    >
                                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                                                        ></path>
                                                                    </svg>{" "}
                                                                    Delete
                                                                </button>
                                                            </Link>
                                                        </div>

                                                        <div className="d-flex">
                                                            <Link className="action_btn enable_btn edit" href="/">
                                                                <i className="bi bi-check-circle-fill"></i>
                                                            </Link>

                                                            <Link className="action_btn excel_btn edit" href="/">
                                                                <img
                                                                    className="del-icon"
                                                                    style={{ width: "16px" }}
                                                                    src="/assets/front-images/export-icon.png"
                                                                    alt=""
                                                                />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr> */}

                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="paginator col-sm-12">
                                        <ul className="pagination justify-content-center">
                                            <li className="prev disabled">
                                                <Link href="/"><i className="bi bi-chevron-left"></i> Previous</Link>
                                            </li>
                                            <li className="next disabled">
                                                <Link href="/">Next <i className="bi bi-chevron-right"></i></Link>
                                            </li>
                                        </ul>
                                        <div className="text-center">
                                            <p className="paginate_p text-14">
                                                Page 1 of 1, showing 2 record(s) out of 2 total
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FrontendFooter />

        </>
    )
}