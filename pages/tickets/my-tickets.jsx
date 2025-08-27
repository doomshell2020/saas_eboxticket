import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";


const MyTicket = () => {
    return (
        <>
            <FrontendHeader />
            <div>
                <section >
                    <div className="heading">
                        <h1>My Ticket</h1>
                        <h2>Manage your tickets</h2>
                        <p>Here you can manage your tickets</p>
                    </div>
                </section>
            </div>

            <FrontendFooter />
        </>
    )
}

export default MyTicket