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
            <FrontLeftSideBar />
            <FrontendFooter />

        </>
    )
}

export default MyEventsPage