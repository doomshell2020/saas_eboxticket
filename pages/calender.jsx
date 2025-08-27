import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";


const Calender = () => {
    return (
        <>
            <FrontendHeader />
            <div>
                <section >
                    <div className="heading">
                        <h1>Calender</h1>
                        <h2>Event Calender</h2>
                        <p>Event Calender </p>
                    </div>
                </section>
            </div>

            <FrontendFooter />
        </>
    )
}

export default Calender