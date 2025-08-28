import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontendHeader from "@/shared/layout-components/frontelements/frontendheader";
import FrontendFooter from "@/shared/layout-components/frontelements/frontendfooter";


const MyTicket = () => {
    const [backgroundImage, setIsMobile] = useState('https://eboxtickets.com/images/about-slider_bg.jpg');
    return (
        <>
            <FrontendHeader backgroundImage={backgroundImage} />
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