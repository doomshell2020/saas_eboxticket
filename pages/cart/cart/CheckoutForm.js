// components/CheckoutForm.js
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import {
  useStripe,
  useElements,
  Elements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect, useState, useCallback } from "react";
import { Button, Col, Row, Modal, Form } from "react-bootstrap";
import axios from "axios";
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
const stripePromiseDev = loadStripe(process.env.STRIPE_DEV_PUBLIC_KEY);

// Loading Component
const LoadingComponent = ({ isActive, clientSecret }) =>
  isActive && (
    <div
      style={{
        display: "flex",
        background: "rgba(255, 255, 255, 0.7)",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        zIndex: 9998,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        className="fas fa-spinner fa-3x fa-spin"
        style={{ color: "black" }}
      />
    </div>
  );

const CheckoutForm = ({ showNextStep }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setErrorMessage(null); // Clear any previous error message
    // Validate the form
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      setErrorMessage("Please complete all required fields.");
      return;
    }
    // Check if the card details are provided
    const cardElement = elements.getElement(PaymentElement);
    if (!cardElement || cardElement._empty) {
      setValidated(true);
      setErrorMessage("Please enter your card details.");
      return;
    }
    setIsLoading(true);
    // Ensure that stripe and elements are properly loaded
    if (!stripe || !elements) {
      setValidated(true);
      setErrorMessage("Stripe has not loaded. Please try again later.");
      return;
    }

    try {
      // Confirm the payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Dynamically inject the payment_intent.id into the return_url
          // return_url: `${window.location.origin}/order-confirmation`,
          return_url: `${window.location.origin}/order-confirmation`,
        },
      });

      if (error) {
        // Handle Stripe errors like card declined, network issues, etc.
        setErrorMessage(error.message);
        setIsLoading(false);
        setValidated(true);
      } else {
        setValidated(false);
        // Payment successful
        setErrorMessage(null);
        // setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      // Catch any unexpected errors
      console.error("Payment error:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  // Show loader until form is ready
  useEffect(() => {
    if (elements) {
      const paymentElement = elements.getElement(PaymentElement);
      if (paymentElement) {
        paymentElement.on("ready", () => setIsLoading(false));
      }
    }
  }, [elements]);

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <LoadingComponent isActive={isLoading} />

      <PaymentElement onReady={() => setIsLoading(false)} />

      {errorMessage && (
        <div
          style={{
            color: "#9e2146",
            marginTop: "10px",
            textAlign: "center",
          }}
        >
          {errorMessage}
        </div>
      )}

       <div className="secnd-flw-trms">
        <h3 className="terms-hd">Terms and Conditions</h3>

      

    

        <p style={{ textIndent: "0" }}>
          This Ticket Terms and Conditions, and Waiver and Release
          (“Waiver and Release” or this “Agreement”), is entered into by
          and between the purchaser and/or user of the Event (as defined
          below) ticket and/or participant and/or attendee of the Event
          (“you&quot; or “Participant” or “Attendee”), on the one hand, and
          Experiencias de la Costa SA de CV, a Mexican limited liability
          company, and Ondalinda Productions, LLC, a Delaware limited liability company, on the other hand (collectively “we” or
          “ONDALINDA X CAREYES” or “ONDALINDA”). Participant and
          ONDALINDA X CAREYES may collectively be referred
          hereinafter as the &quot;Parties.&quot;
        </p>



        <p style={{ textIndent: "0" }}>
          WHEREAS the Participant wishes to attend the Event;
        </p>

        <p style={{ textIndent: "0" }}>
          WHEREAS the Participant agrees to retain full responsibility to be informed of any applicable local legislation and customs, follow the guidelines of the Event, identify and avoid all potential hazards, take reasonable and necessary precautions, carry proper gear, wear proper clothing and remain well hydrated;
        </p>

        <p style={{ textIndent: "0" }}>
          WHEREAS the Participant enters into this Agreement as
          medically, physically, and mentally able to participate in the
          Event with respect to the services provided by ONDALINDA X
          CAREYES, upon the terms and conditions hereinafter set forth;
          and
        </p>
        <p style={{ textIndent: "0" }}>
          WHEREAS the terms set forth below are applicable to all participants of the Event for the duration of their stay and participation at the Event.
        </p>



        <p style={{ textIndent: "0" }}>
          By purchasing and/or using an Event ticket, you agree to be
          bound by this Agreement, and to the Terms of Service which are
          available at <Link href="https://ondalinda.com/terms/" target="_blank">www.ondalinda.com/terms/</Link>. The “Event” means the
          ONDALINDA x CAREYES 2025, a music, art and wellness
          festival that will be held in Costa Careyes in Jalisco, Mexico, on
          November 6, 2025 through November 9, 2025.
        </p>
        <p style={{ textIndent: "0" }}>
          For good and valuable consideration, the Parties agree as
          follows:
        </p>

        <h6 style={{ fontWeight: "400" }}>TERM</h6>

        <p>
          This Agreement shall be of full force and effect throughout the
          duration of the 2025 Event (November 6, 2025 through
          November 9, 2025) (the “Term”) unless otherwise expressed in
          this Agreement.
        </p>


        <h6 style={{ fontWeight: "400" }}>LIMITATION OF LIABILITY</h6>
        <ol type="1">
          <li>
            ONDALINDA disclaims liability arising out of
            attendance at the Event, or any ONDALINDA affiliated
            activity in connection with the Event. In no event will
            we or our members, managers, officers, employees,
            directors, parents, subsidiaries, affiliates, agents or
            licensors be liable for any direct, indirect, incidental,
            special, consequential or exemplary damages,
            including but not limited to, damages for loss of
            revenues, lost registration fees, profits, goodwill, use, data, lost real estate opportunities, or business
            interruptions or other intangible losses (even if such
            parties were advised of, knew of or should have known
            of the possibility of such damages, and
            notwithstanding the failure of essential purpose of any
            limited remedy), arising out of or related to your
            attendance at one the Events), regardless of whether
            such damages are based on contract, tort (including
            negligence and strict liability), warranty, statute or
            otherwise.

          </li>
        </ol>




        <h6 style={{ fontWeight: "400" }}>ATTENDEE CONDUCT AT EVENTS</h6>

        <ol type="1">
          <li>
            All participants and attendees at the Event, including
            You and Your guests, must be approved by
            ONDALINDA through advance registration and wear
            official wristbands designating proper registration.
          </li>
          <li>
            We reserve the right to remove Attendees who do not
            comply with the proper registration, security
            procedures or requirements of Attendee conduct
            outlined below at any point during the Event without a
            refund. ONDALINDA reserves the right to remove
            anyone who disobeys any requirements, procedures,
            policies or regulations of the Event.
          </li>
          <li>
            You may not impersonate any person or entity, or
            falsely state or otherwise misrepresent Your affiliation
            with a person or entity.
          </li>
          <li>
            You may not aid in gaining an unauthorized person
            access to the Event; this is grounds for removal
            without refund.
          </li>
          <li>
            You must not defame, abuse, harass, harm or threaten
            others, make any bigoted, hateful, or racially offensive
            statements.
          </li>
          <li>
            You may not advocate illegal activity or discuss illegal
            activities with the intent to commit them or cause injury
            or property damage to any person. You may not post
            or distribute any material that infringes and/or violates
            any right of a third party or any law or post or distribute
            any vulgar, obscene, discourteous, or indecent
            language or images.
          </li>
          <li>
            You may not advertise or sell to or solicit others
            excessively.
          </li>
          <li>
            You may not hand out, transmit or otherwise make
            available any unsolicited or unauthorized advertising,
            promotional materials, or any other form of solicitation,
            except in those areas that are designated for such
            purpose.
          </li>
          <li>
            <i>
            All ONDALINDA sales are final, and any fees are
            nonrefundable. No refunds or exchanges will be issued
            for any reason. You acknowledge and accept the
            cancellation/refund policy set forth in the Terms of
            Service.
            </i>
        
          </li>
        </ol>

        <p style={{ color: "#b03aff" }}>All tickets are non-refundable but may be transferred to another
          Ondalinda member after approval by the Ondalinda team. Exceptions
          or discounts can not be made for any reason, including weather,
          injury/illness, or personal emergencies. No refunds or credits will be
          granted for failure to attend, complete, or for arriving late / leaving
          early.</p>
        <ol type="1" start={10}>
          <li>
            If we deem any online, social networking, or other
            media reference post, article, photo or video regarding
            the Event inappropriate, the offender is required to
            take down the material immediately upon our request
            for removal. If the posting is made during the Event,
            this may be grounds for dismissal from an Event,
            removal and preclusion from the Site and future
            involvement in ONDALINDA.
          </li>
          <li>
            Without limitation of the foregoing, ONDALINDA may,
            in its sole and absolute discretion, remove You or any
            other Attendee from the Event, without explanation,
            either before or during the Event, if such Attendee
            engages in any unlawful, unauthorized, prohibited,
            improper, or unethical activities, or any other acts or
            omissions that we deem worthy of Your removal from
            the Event.
          </li>

        </ol>

        <h6 style={{ fontWeight: "400" }}>CHARGEBACKS</h6>

        <p>
          <i>
          You agree that You will not attempt to evade, avoid, or
          circumvent any refund prohibitions in any manner with regard to
          tickets You purchased. Without limiting the generality of the
          foregoing, You will not dispute or otherwise seek a “chargeback”
          from the company whose credit card or other method of
          payment You used to purchase tickets from the Site. Should you
          do so, your tickets are subject to immediate cancellation, and we
          may, in our sole discretion, refuse to honor pending and future
          ticket purchases made from all credit card accounts or online
          accounts on which such chargebacks have been made, and
          may prohibit future purchases from all persons in whose name
          the credit card accounts exist, and from any person who
          accesses any associated online account or credit card or who
          otherwise breaches this provision from using the Site.
          </i>
         

        </p>

        <h6 style={{ fontWeight: "400" }}>UNAUTHORIZED USES OF INTELLECTUAL PROPERTY</h6>

        <ol type="1">
          <li>
            You may not copy, reproduce, republish, download,
            post, broadcast, record, transmit, commercially exploit,
            edit, communicate to the public or distribute in any way
            our materials provided or displayed at an Event, other
            than for Your own personal use.
          </li>
          <li>
            We retain the rights to all staff photography and video
            footage from the Event.
          </li>
          <li>
            Any use other than that permitted under this clause
            may only be undertaken with our prior express written
            authorization.
          </li>


        </ol>

        <h6 style={{ fontWeight: "400" }}>RECORDING, TRANSMISSION AND EXHIBITION</h6>
        <p>
          You agree that the Event for which You attend is a public event,
          that Your appearance and actions inside and outside the venue
          where the Event occurs are public in nature, and that You have
          no expectation of privacy with regard to Your actions or conduct
          at the Event. You grant permission to ONDALINDA, our
          partners, licensees and assigns, including but not limited to our
          brand and media partners, to utilize Your name, image, likeness,
          acts, poses, plays, appearance, movements, and statements in
          any live or recorded audio, video, or photographic display or
          other transmission, exhibition, publication or reproduction made
          of, or at, the Event (regardless of whether before, during or after
          the event) for any purpose, in any manner, in any medium or
          context now known or hereafter developed, without further
          authorization from, or compensation to, You or anyone acting on
          Your behalf.

        </p>


        <h6 style={{ fontWeight: "400" }}>YOU ARE SUBJECT TO SEARCH</h6>

        <p>
          You and Your belongings may be searched on entry to the
          Event. You consent to such searches and waive any related
          claims that may arise. If You elect not to consent to such
          searches, You may be denied entry to the Event without refund
          or other compensation. Certain items may not be brought into
          the premises of the Event, including without limitation: firearms,
          alcohol, drugs, and controlled substances.
        </p>

        <h6 style={{ fontWeight: "400" }}>WAIVER AND RELEASE</h6>

        <ol type="1">
          <li>
            Throughout this Agreement, ONDALINDA X
            CAREYES includes Experiencias de la Costa Sa de
            Cv., Ondalinda Productions, LLC, and each of their
            affiliates, officers, directors, members, managers,
            agents, contractors, employees, coaches/instructors,
            volunteers, vendors and the manufacturers and
            distributors of the equipment used in any Event.
          </li>
          <li>
            The term “Event” encompasses all activities,
            programs, events, and services provided, sponsored
            or organized by ONDALINDA X CAREYES including
            but not limited to, social activities, volunteering for
            ONDALINDA X CAREYES, or consuming any food
            items provided by ONDALINDA X CAREYES. The
            participants with food or insect intolerance or allergies
            are responsible for making sure they are not exposed
            or ingesting any of the allergens.
          </li>
          <li>
            Duties of the Participant: During the Term of this
            Agreement, the Participant shall have the full and
            complete responsibility to perform the obligations set
            forth in this Agreement with ONDALINDA X
            CAREYES.
          </li>
          <li>
            Expenses of Participant: The Participant shall be
            responsible for arranging all food, beverage, medical
            or other personal expenses outside the Event. The
            Participant shall be fully responsible for all belongings
            and valuables brought to the Event. The Participant
            shall be liable for reimbursing ONDALINDA X
            CAREYES at their demand, for any and all expenses
            afforded by ONDALINDA X CAREYES on behalf of the
            Participant, that falls outside the scope of this
            Agreement. The terms of this Paragraph V shall
            survive termination of the Agreement and shall remain
            binding upon the Parties hereto and in full force and
            effect following termination of this Agreement.
          </li>

          <li>
            Medical/Health &amp; Travel Insurance: The Participant is
            solely responsible to select and purchase adequate
            medical/health insurance throughout the course of the
            Event and any affiliated trip. The Participant freely
            accepts and assumes all responsibility to provide
            him/herself with the appropriate medical/health
            insurance coverage. In the event of any accident,
            injury, illness or other medical/health problem,
            ONDALINDA X CAREYES shall not be liable for any
            costs associated with such medical/health issues nor
            shall ONDALINDA X CAREYES pay for any
            medical/health expenses, which may be required
            during the participation in any programs (as a
            participant, volunteer or performer); provided that,
            during the Event, or while visiting Costa Careyes, it is
            the responsibility of the Participant to alert
            ONDALINDA X CAREYES of any relevant medical
            conditions. ONDALINDA X CAREYES reserves the
            right to refuse or deny the Participant entry to the
            Event or any Event activity, at ONDALINDA X
            CAREYES’s sole discretion, should the Participant
            appear to be unfit to safely engage in any event or
            activity as determined by ONDALINDA X CAREYES
            representatives. The terms of this paragraph shall
            survive the termination of the Agreement and shall
            remain binding upon the Parties hereto and in full force
            and effect following termination of this Agreement.
            Servicios para la Costa Sur AC known as Careyes
            Clinic is an independent organization that has no
            affiliation with ONDALINDA X CAREYES or the Event.
            Anything administered, any procedures operated, or
            any medical advice that is given, has no affiliation with
            ONDALINDA X CAREYES or the Event. Participant
            understands and acknowledges that it is their
            responsibility to consult with a qualified health authority
            prior to and regarding their participation in the Event.
            Participant represents and warrants that they are
            adequately fit and of sound ability to take responsibility
            for the choice to participate in the Event. Participant
            understands their own physical limitations and is
            sufficiently self-aware to stop physical activity before
            becoming ill or injured.
          </li>

          <li>
            Personal Responsibility: ONDALINDA X CAREYES
            shall not be held liable for intentional or criminal
            actions of the Participant. Participant shall indemnify
            ONDALINDA X CAREYES in the event any third-party
            claims are brought against ONDALINDA X CAREYES
            that arise from an intentional or criminal act of
            Participant. By entering the Event, you (i) acknowledge
            the contagious nature of COVID-19 and voluntarily
            assume the risk that you may be exposed to or
            infected by COVID-19 and that such exposure or
            infection may result in personal injury, illness,
            permanent disability, and/or death, (ii) voluntarily agree
            to assume all of the foregoing risks and accept sole
            responsibility for any injury, illness, damage, loss,
            claim, liability, or expenses, of any kind (“Claims”), that
            you may experience or incur, and (iii) hereby release,
            covenant not to sue, discharge, and hold harmless
            ONDALINDA X CAREYES from Claims of any kind
            arising out of or relating thereto.
          </li>

          <li>
            Description of Risks: In consideration of participation in
            any programs, the Participant acknowledges that
            he/she is aware of, and freely accepts the inherent
            risks, dangers and hazards associated with some
            physical activities, including the possible risk of severe
            or fatal injury, and in extraordinary cases death. These
            risks include but are not limited to:
            <br></br>
            - all manner of injuries such as muscular and soft
            tissue injuries including bruises, scrapes, cuts, etc.
            resulting from engaging in strenuous and demanding
            physical activities, contact with other participants,
            volunteers or performers and failure in proper use of
            equipment either by the Participant or other
            participants, or volunteers;
            <br></br>

            - all manner of injuries resulting in sprains,
            dislocations, concussion, and broken bones, heart
            attack/stroke, spinal injury and tendonitis;
            <br></br>
            - all manner of injuries related to bites or stings from
            animals or insects including but not limited to
            scorpions and snakes;
            <br></br>
            - all manner of head, facial, eye and/or dental injuries;
            <br></br>
            - all manner of hearing damage due to excessive
            exposure to loud music;
            <br></br>
            - all manner of medical problems resulting from heat
            exhaustion, dehydration, asthma, communicable
            diseases, food poisoning, skin rashes, cramps,
            chemical poisoning, and lack of fitness or conditioning;
            <br></br>
            - all manner of injuries and/or death that could result
            from a physical confrontation whether caused by the
            Participant or someone else;
            <br></br>
            - all manner of illness and/or death that could result
            from COVID-19 exposure;
            <br></br>
            - all manner of injuries and/or death that may result
            from collision with other participants on foot, bikes,
            motor vehicles and/or shuttles; and
            <br></br>
            - all manner of injuries that may result from
            participation in wellness activities including but not
            limited to temazcal, water activities, pilates, yoga,
            sunset ceremonies, circulo de palabra, mushroom
            workshop or cacao ceremonies. 
             <br></br>
            Participant acknowledges the following details:
            <br></br>
            - risk of possible injury increases as a Participant
            becomes fatigued; the property where the Event will
            take place is remote and includes rocky, terrain, cliffs,
            beaches and other bodies of water, which may contain
            potentially harmful plants and animals, included but not
            limited to snakes, lizards, mosquitoes, scorpions, ticks,
            crocodiles and poisonous plants.
            <br></br>
            - all events are on the oceanfront and it can be
            dangerous, especially in Teopa, Playa Rosa, El
            Careyes, Careyitos and Zyanya in
            Chamela, where the waters may not be swimmable.
            ONDALINDA X CAREYES shall in no way be
            responsible for any accident related to this inherent
            danger. Participant agree they are taking this risk by
            attending the Event.
            <br></br>
            - all of the scenery, props, and installations that will be
            displayed during the Event are not to be climbed on,
            walked on, or ridden at Participant’s own risk.
          </li>

          <li>
            Waiver, Release and Agreement Not to Sue:
            Participant, on his/her own behalf, his/her assigns,
            executors, guardians and all other legal
            representatives, hereby releases, discharges, waives
            and forever relinquishes ONDALINDA X CAREYES,
            Experiencias de la Costa Sa de Cv., Ondalinda
            Productions, LLC, and each of their affiliates
            (including, without limitation, property owners in
            Careyes), and each of their agents, employees,
            officers, directors, members, managers, employees
            and any other person associated with the
            aforementioned persons and entities (collectively, the
            “Released Parties”), from any and all present and
            future known or unknown claims, including, without
            limitation, claims for property damage, personal injury,
            or death resulting from, arising out of or in any way
            connected to Participant’s participation at the Event,
            including, but not limited to, claims actually or allegedly
            arising out of or relating to the negligence of any of the
            Released Parties, wherever, whenever, or however the
            damage, injury, or death may occur. Participant further
            agrees that under no circumstance will Participant
            attempt to present any claims against, prosecute, sue,
            seek to attach any lien for any purpose including
            satisfaction of a judgment or other judicial decree, to
            the property of the Released Parties. Participant
            understands and agrees that the Released Parties are
            not responsible for any harm, such as property
            damage, personal injury, or death, arising out of or in
            any way related to Participant’s participation at the
            Event, including harm caused by the Released Parties’
            actual or alleged negligence. IT IS THEREFORE
            PARTICIPANT’S INTENTION TO EXEMPT AND
            RELIEVE THE RELEASED PARTIES FROM ALL
            LIABILITY, INCLUDING, BUT NOT LIMITED TO,
            LIABILITY FOR ANY PERSONAL INJURY,
            PROPERTY DAMAGE, OR DEATH, INCLUDING,
            WITHOUT LIMITATION, THAT CAUSED BY THE
            RELEASED PARTIES’ ACTUAL OR ALLEGED
            NEGLIGENCE. PARTICIPANT FURTHER AGREES
            TO EXPRESSLY WAIVE THE PROVISIONS OF
            CALIFORNIA CIVIL CODE SECTION 1542 WHICH
            PROVIDES:
            <br></br>

            A GENERAL RELEASE DOES NOT EXTEND TO
            CLAIMS WHICH THE CREDITOR DOES NOT KNOW
            OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT
            THE TIME OF EXECUTING THE RELEASE, WHICH
            IF KNOWN BY HIM OR HER MUST HAVE
            MATERIALLY AFFECTED HIS OR HER
            SETTLEMENT WITH THE DEBTOR.
          </li>

          <li>
            In consideration of being permitted to participate in and
            attend the Event, Participant agrees to comply with
            any and all rules, regulations, terms, and conditions of
            ONDALINDA X CAREYES and acknowledge and
            agree to the following:
            <ol type="1">
              <li>Participant acknowledges and fully
                understands that as a Participant, Participant
                will be engaging in activities that involve risk
                of serious injury, including permanent
                disability and death, property loss and severe
                social and economic losses. These risks may
                include, but are not limited to, those caused
                by: (a) the actions, inactions, or negligence
                of the organizers of ONDALINDA X
                CAREYES and/or other participants in the
                Event; (b) existing conditions of the premises
                or equipment used; (c) rules and regulations
                regarding the activities; (d) temperature; (e)
                weather; (f) physical or mental condition of
                other participants; (g) the use by Participants
                and by ONDALINDA X CAREYES of fire,
                pyrotechnics, flame effects, explosions, and
                other similar activities; (h) vehicular traffic;
                and (i) participating in the Event during the
                COVID-19 pandemic. Participant further
                acknowledges and fully understands that
                there may also be other risks that are not
                known or foreseeable at this time by
                ONDALINDA X CAREYES. PARTICIPANT
                KNOWINGLY AND VOLUNTARILY
                ASSUMES ALL RISK OF PROPERTY
                LOSS, PERSONAL INJURY, SERIOUS
                INJURY, OR DEATH, WHICH MAY OCCUR
                BY ATTENDING THE EVENT, AND
                HEREBY RELEASE, DISCHARGE, AND
                HOLD ONDALINDA X CAREYES
                HARMLESS IN PERPETUITY FROM ANY
                CLAIM ARISING FROM SUCH RISK, EVEN
                IF ARISING FROM THE ORDINARY
                NEGLIGENCE OF ONDALINDA X
                CAREYES, OR NEGLIGENCE OF THIRD
                PARTIES, AND PARTICIPANT ASSUMES
                FULL RESPONSIBILITY AND LIABILITY
                FOR PARTICIPANT’S PARTICIPATION.
                </li>
              <li>Participant acknowledge that Participant is
                required to comply with any COVID-19
                regulations set by ONDALINDA x CAREYES
                which may include on-site Antigen testing,
                proof of vaccination, or a negative PCR or
                Antigen COVID-19 test for entry.</li>
              <li>Participant understands that during the
                Event, art installations, stages, vehicles,
                events, and performances will be held and/or
                on display, and Participant understands that
                most of these activities are not owned or
                operated by ONDALINDA X CAREYES.
                PARTICIPANT HEREBY ASSUMES ALL
                RISK OF INJURY OR DEATH ARISING
                FROM THEIR OPERATION AND FROM
                PARTICIPATION IN ANY OF THESE
                ACTIVITIES APPLIES UNDER THIS
                AGREEMENT AND ANY INJURY
                PARTICIPANT MIGHT SUSTAIN RELATING
                TO PARTICIPANT’S PARTICIPATION IN
                ANY OF THESE ACTIVITIES AND
                PARTICIPANT SHALL NOT ATTEMPT TO
                HOLD ONDALINDA X CAREYES LIABLE
                FOR SUCH INJURIES.
              </li>
              <li>
                Participant agrees to indemnify, defend, and
                hold the Releasees harmless from and
                against any and all claims by third parties for
                damages, injuries, losses, liabilities, and
                expenses relating to, resulting from, or
                arising out of Participant’s participation in the
                Event, including any programs, events, art
                installations, or activities at the Event.
                Participant intends that this Agreement shall
                be construed broadly to provide a release
                and waiver to the maximum extent
                permissible under California and Mexican
                law.
              </li>
              <li><u>Intellectual Property:</u>
                PARTICIPANT
                UNDERSTANDS AND ACCEPTS THAT
                PARTICIPANT HAS NO RIGHT TO ANY
                USE OF ANY IMAGES OR AUDIO/VISUAL
                FOOTAGE OF THE EVENT (“EVENT
                IMAGERY”) WITHOUT PRIOR WRITTEN
                CONSENT FROM ONDALINDA
                PRODUCTIONS, LLC, OTHER THAN FOR
                PARTICIPANT’S PERSONAL, NON-
                COMMERCIAL USE (“PERSONAL USE”).
                Participant understand that Participant has
                no right to sell, transfer, license, sublicense,
                or give my Event Imagery to any other party,
                except for Personal Use, and Participant
                agrees to cause any third party to whom
                Participant gives Event Imagery to also only
                use for Personal Use. Without the prior
                written consent of ONDALINDA
                PRODUCTIONS, LLC, Participant
                understands that Participant may not use any
                (1) Event Imagery, (2) drawings or
                representations of the Ondalinda mark
                and/or symbols, or (3) any copyrights,
                trademarks, or other intellectual property
                owned or licensed by ONDALINDA
                PRODUCTIONS, LLC. Participant
                acknowledges and agrees that Participant
                may not use any of the above in any
                advertisement, promotional materials
                (including music videos), or in the title or on
                the cover of any publication designed for
                public dissemination (other than personal
                blog posts).
              </li>
              <li>
                To the extent Participant may have rights in
                and to the Event Imagery, Participant hereby
                assigns to ONDALINDA PRODUCTIONS,
                LLC all right, title and interest in the copyright
                to Participant’s Event Imagery that
                Participant may have for the purpose of
                enabling ONDALINDA PRODUCTIONS, LLC
                to enforce the copyright against any party
                that displays or disseminates any of the
                Event Imagery in a manner prohibited by or
                not so authorized by this Agreement.
                Participant hereby appoint ONDALINDA
                PRODUCTIONS, LLC as Participant’s
                attorney-in-fact to execute any documents
                necessary to effectuate such assignment in
                intellectual property rights. If Participant
                posts, or allows to be posted, any Event
                Imagery on a personal website or a website
                controlled by a third party, even if permissible
                as Personal Use; Participant shall not license
                any Event Imagery that contains any nudity
                or partial nudity (including any imagery in
                which bare breasts, bare buttocks, genitals,
                or genital areas are visible); and (3) if for any
                reason whatsoever, at ONDALINDA
                PRODUCTIONS, LLC’s sole discretion, it is
                determined that any such images must be
                removed, Participant will promptly remove or
                cause those images to be removed.
                ONDALINDA PRODUCTIONS, LLC reserves
                all rights to revoke any creative commons
                license that was erroneously placed on Event
                Imagery in violation of this Agreement and
                may cause the removal of such Event
                Imagery on any webpage on which it is
                displayed. Participant understands that use
                of the creative commons’ licenses approved
                herein does not supersede this Agreement,
                nor Participant’s responsibility as the
                photographer or videographer to obtain all
                necessary permissions from subjects and
                artists as appropriate under any applicable
                law. ONDALINDA PRODUCTIONS, LLC
                requires any party interested in making any
                commercial use of their documentation of the
                Event or in distributing footage beyond
                Personal Use to enter into a separate written
                agreement with ONDALINDA
                PRODUCTIONS, LLC.
              </li>
              <li>
                Participant acknowledges that “ONDALINDA”
                and the ONDALINDA logo/symbol are
                registered trademarks owned or licensed by
                Checkmark Inc., and that Checkmark Inc and
                ONDALINDA PRODUCTIONS, LLC have the
                exclusive right to license and enforce those
                trademarks and any other trademarks,
                copyrights, or other intellectual property
                owned by or licensed to Checkmark Inc,
                including any likenesses, drawings, and
                representations of the ONDALINDA mark
                and/or symbol (“ONDALINDA IP”).
                Participant acknowledges that Checkmark
                Inc is not granting Participant any rights in
                any ONDALINDA IP and that any such grant
                shall be made by a separate writing signed
                by both Parties. Participant agrees that
                Participant will not use any ONDALINDA IP
                on any website (except for Personal Use, as
                described in Section 5 above) or in any other
                manner, commercial or otherwise, unless the
                use constitutes a fair use under United
                States Copyright law. Checkmark Inc only
                permits the use of ONDALINDA IP, without
                payment of any license fee, on materials that
                are given away at the Event or in connection
                with ONDALINDA X CAREYES (“Gift
                Materials”), under the following conditions:
                (1) Checkmark Inc may, for any reason in its
                sole discretion, determine that such use is
                not in maintaining Checkmark Inc quality
                control, and if so, all such materials shall no
                longer be utilized; and (2) no ungifted Gift
                Materials may be sold or transferred in
                exchange for something of value or
                distributed in any form such that the Gift
                Materials are likely to be sold or transferred
                in exchange for something of value.
              </li>
              <li>
                Participant acknowledges that other parties,
                including but not limited to other participants
                will be using film, video, and photographic
                cameras at the Event, and that my image
                may be captured on film, video, or
                photographs that may subsequently be
                displayed or disseminated without my
                consent or payment of compensation to me,
                and I hereby release ONDALINDA X
                CAREYES from any liability due to such
                filming, photographing, or dissemination.
                Participant acknowledges that by purchasing
                a ticket and attending the Event, Participant
                is consenting to be filmed or photographed
                while participating in any activities or
                throughout the course of the Event.
                Participant grants permission to the
                Released Parties and any transferee or
                licensee or any of them, to utilize any
                photographs, motion pictures, videotapes,
                recordings and other references or records of
                the Event, which may depict, record or refer
                to Participant for any purpose (“Likeness”),
                including commercial use by the Released
                Parties and their licensees. This permission
                is for use perpetually, worldwide, and in any
                medium now known or hereafter devised.
                Participant understands and agrees that
                Participant shall not be compensated or
                receive additional consideration for this
                consent to the use of Participant’s Likeness
                and that Participant will not be given a
                chance to receive, inspect or approve the
                promotional or marketing material, messages
                and/or content that may incorporate or use
                Participant’s Likeness.
              </li>
              <li>
                Participant understands that some
                participants at the Event may engage in
                expressive activity and dress, which may
                include partial nudity or nudity and other
                types of expressive activity. Participant
                agrees that such expressive activity and
                dress is neither indecent nor offensive to
                Participant, and that Participant has decided
                to attend the Event with full knowledge that
                such expressive activity and dress may
                occur. If Participant is accompanied by
                minors at the Event in breach of this
                Agreement, Participant nevertheless
                acknowledges that Participant is aware, has
                consented on their behalf, and are aware
                that the minors may be exposed to the
                expressive activities and dress that take
                place at the Event, and that Participant has
                exercised parental responsibility and control
                in bringing the minors to the Event. Should
                Participant find that any activity at the Event
                is offensive to Participant, or to any minors
                accompanying Participant, Participant
                acknowledge that Participant can avoid such
                activity by, among other things, leaving the
                vicinity of the activity or leaving the Event.
              </li>
              <li>
                Participant understands that children under
                18 years of age cannot attend the Event
                even if accompanied by a parent or guardian.
              </li>
              <li>
                Participant acknowledges that all vehicles,
                including trucks, trailers, and recreational
                vehicles, shuttles, entering the Event are
                subject to search by gate staff for
                stowaways, pets, weapons, live plants,
                fireworks, handheld lasers, or other
                dangerous, illegal or prohibited items.
                Parking is strictly prohibited at all official
                ONDALINDA x CAREYES events. Pre-
                allocated parking permits will be required for
                entry.
              </li>
              <li>
                Participant agrees to read and abide by the
                terms and all information listed in this
                Agreement as well as in the Welcome
                Package which Participant will receive at
                registration.
              </li>
              <li>
                Participant hereby consents to have
                emergency medical treatment that may be
                deemed advisable in the event of injury,
                accident, and/or illness during any program,
                event, or activity at the Event. Participant
                releases ONDALINDA X CAREYES and all
                persons participating in any such medical
                treatment from all responsibility for any such
                actions that are required to be taken.
              </li>
              <li>
                <i>
                Participant agrees that ONDALINDA X
                CAREYES is not liable for acts of God, the
                weather, natural disasters, strikes, protests,
                civil unrest, blackouts, labor disputes,
                technical failures, terrorism and criminal acts
                (including narco-related), disease outbreaks,
                any epidemic, pandemic (including the
                COVID-19 pandemic and any travel
                restrictions as a result imposed by any
                government impacting the Event),
                quarantine, failure to obtain government
                permits, or actions taken by government
                agencies and similar causes beyond
                ONDALINDA X CAREYES’s control
                (collectively “Force Majeure”).
                Participant understands that any fees paid by
                Participant are nonrefundable even if the
                Event is terminated early or canceled, or
                entry conditions are modified, due to a Force
                Majeure.
                </i>
              </li>
              <li>
                Participant understands and agrees to the
                following (1) Participant must bring
                sunscreen, insect repellent, adequate
                footwear, prescription medication and first
                aid supplies to be comfortable during the
                Event in a natural tropical environment as
                ONDALINDA X CAREYES shall not provide
                these items; (2) guns, fireworks, rockets, and
                other explosives are expressly prohibited; (3)
                handheld lasers of any kind are expressly
                prohibited; and (4) this is a LEAVE NO
                TRACE, pack it IN, pack it OUT event,
                meaning all waste shall be properly disposed
                of and all personal items shall be taken at the
                end of the Event.
              </li>
              <li>
                Participant understands that commercial
                vending of any kind, including without
                limitation the provision of any goods or
                services delivered to or at the Event for a
                prepaid fee, is prohibited except as
                authorized by ONDALINDA X CAREYES and
                permitted by the Municipality of Costa
                Careyes, Mexico.
              </li>
              <li>
                As part of the vehicle pass process,
                Participant understands that Participant must
                provide current contact information.
                ONDALINDA X CAREYES retains the right
                to cancel, rescind or revoke any vehicle pass
                at any time for any reason whatsoever at
                ONDALINDA X CAREYES’s sole discretion.
                Vehicle passes are revocable licenses that
                may be revoked by ONDALINDA X
                CAREYES for any reason, including without
                limitation assisting people with unauthorized
                entry to the Event.
              </li>
              <li>
                <i>
                Refunds and Cancellation Policy: All sales
                are final. No refunds or exchanges will be
                issued for any reason. Fees are
                nonrefundable. Participant acknowledges
                and accepts the Refund and Cancellation
                Policy as made available on the
                ONDALINDA X CAREYES website
                (<Link href="https://ondalinda.com/terms" target="_blank">www.ondalinda.com/terms</Link>).
                </i>
              </li>
              <li>
                <span style={{ color: "#b03aff" }}>
                If we can not host the festival and must
                cancel, we will of course notify you as soon
                as possible. In this case, you have the option
                to receive either a 50% refund of your ticket
                (excluding taxes &amp; fees) or you can choose
                to transfer your ticket for the next festival.
                However, we are not accountable for your
                expenses incurred in preparation for the
                event, such as airline tickets, housing, loss of
                work, and/or other costs associated with
                preparation for your trip. We recommend
                always getting your own travel insurance.</span>
              </li>
              <li>
                Any possession of firearms and/or weapons
                at the Event is strictly prohibited.
              </li>
              <li>
                Any possession, use and/or sale of illegal
                drugs or any other illegal substances at the
                Event is strictly prohibited and punishable by
                law.
              </li>
              <li>
                Driving under the influence of any alcohol or
                any narcotic is strictly prohibited and
                punishable by law. In addition to the waiver
                provisions above, ONDALINDA X CAREYES
                is not responsible for any injury or property
                damage that results from your violation of
                this provision.
              </li>
              <li>
                The use of the event ticket for advertising,
                promotions, contests, sweepstakes,
                giveaways, etc. without the express written
                consent of ONDALINDA X CAREYES is
                expressly prohibited.
              </li>
              <li>
                The rights and remedies of Participant in the
                event of any material breach by ONDALINDA
                X CAREYES of this Agreement or any of
                ONDALINDA X CAREYES’s obligations
                hereunder shall be limited to Participant’s
                right to recover damages, if any, up to a
                maximum amount equal to the purchase
                price of the tickets, in action at law, and
                Participant hereby waives any right or
                remedy in equity, including, without limitation,
                any rights granted to ONDALINDA X
                CAREYES’s hereunder and/or to seek
                injunctive relief or other equitable relief with
                respect to any breach of ONDALINDA X
                CAREYES’s obligations hereunder.
              </li>


            </ol>

          </li>

          <li>
            Participant understands that this Waiver and Release
            may be reasonably amended or modified by
            ONDALINDA X CAREYES, in its sole discretion, prior
            to the Event, and if so, such revised Waiver and
            Release shall also govern.
          </li>



        </ol>

        <h6 style={{ fontWeight: "400" }}>INDEMNIFICATION</h6>


        <p>
          If anyone brings a claim against us related to your
          attendance/participation at the Event, or your violation of this
          Agreement, you agree to indemnify, defend, and hold
          ONDALINDA and our affiliated companies, suppliers,
          advertisers, and sponsors, and each of our officers, directors,
          shareholders, employees, and agents, harmless from and
          against any and all claims, damages, losses, and expenses of any kind (including reasonable legal fees and costs). We reserve
          the right to take exclusive control and defense of any claim, and
          you will cooperate fully with us in asserting any available
          defenses.
        </p>



        <h6 style={{ fontWeight: "400" }}>CLASS ACTION WAIVER</h6>

        <p>
          YOU AND WE THEREBY EACH AGREE TO WAIVE ANY
          RIGHT TO A JURY TRIAL, AND AGREE THAT YOU AND WE
          MAY BRING CLAIMS AGAINST EACH OTHER ONLY IN AN
          INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR
          CLASS MEMBER IN ANY PURPORTED CLASS OR
          REPRESENTATIVE PROCEEDING.

        </p>



        <h6 style={{ fontWeight: "400" }}>GOVERNING LAW</h6>

        <p>
          These Agreement and any disputes arising under or related
          thereto (whether for breach of contract, tortious conduct or
          otherwise) shall be governed by the laws of Jalisco, Mexico,
          without reference to its conflicts of law principles. You confirm
          and agree that the forum for any dispute between you and
          ONDALINDA X CAREYES arising out of or in connection with
          this Agreement shall be exclusively under Mexican law and in
          the JUZGADO DE PRIMERA INSTANCIA EN MATERIA CIVIL
          DEL VIGÉSIMO NOVENO PARTIDO JUDICIAL EN EL
          ESTADO DE JALISCO. ÁLVARO OBREGÓN NO. 11,
          INTERIOR 11, PLANTA ALTA.
          COL. CENTRO. CIHUATLÁN, JALISCO. C.P. 48970. In any
          such action, You and ONDALINDA hereby irrevocably waive, to
          the fullest extent permitted by requirements of law, any objection
          that it may now or hereafter have to the laying of venue of any
          such action brought in such court and any claim that any such
          action brought in such court has been brought in an
          inconvenient forum.

        </p>

        <h6 style={{ fontWeight: "400" }}>SEVERABILITY</h6>

        <p>
          It is our belief that this Agreement does not contain any
          provision contrary to law. However, if any part of this Agreement
          are determined to be illegal, invalid, or unenforceable, You
          agree that: (a) that part shall nevertheless be enforced to the
          extent permissible in order to effect the intent of the Agreement,
          and (b) the remaining parts shall be deemed valid and
          enforceable.
        </p>




      </div>

      <div className="terms-check">
        <Form.Check
          required
          label="I ACKNOWLEDGE THAT I HAVE READ AND FULLY UNDERSTAND
THESE TERMS OF SERVICE AND THIS WAIVER AND RELEASE OF
LIABILITY. I UNDERSTAND THAT BY AGREEING TO THESE TERMS
OF SERVICE AND THIS WAIVER AND RELEASE I AM GIVING UP
SUBSTANTIAL RIGHTS, AND I DO SO KNOWINGLY AND
VOLUNTARILY WITHOUT ANY INDUCEMENT OR DURESS. "
          // feedback="Please check the terms and conditions."
          feedbackType="invalid"
        />
      </div>

      <div className="secon-flw-btn">
        <Row className="gy-2">
          <Col md={5}>
            <Button
              variant=""
              onClick={() => showNextStep(false)}
              className="btn-out"
              type="button"
            >
              GO BACK
            </Button>
          </Col>
          <Col md={2}></Col>
          <Col md={5}>
            <Button
              variant=""
              className="btn-bg"
              type="submit"
              disabled={!stripe || isLoading}
            >
              {isLoading ? "Processing..." : "PAY NOW"}
            </Button>

            {/* <Link className="accomo-gobck w-100" href={"/accommodations/order-confimation"}>PAY NOW</Link> */}
          </Col>
        </Row>
      </div>
    </Form>
  );
};

const Wrapper = (props) => {

  if (props.userId == 10272) {
    return (
      <Elements
        stripe={stripePromiseDev}
        options={{ clientSecret: props.clientSecret }}
      >
        <CheckoutForm {...props} />
      </Elements>
    );
  } else {
    return (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret: props.clientSecret }}
      >
        <CheckoutForm {...props} />
      </Elements>
    );
  }

};
export default Wrapper;
