import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { Button, Col, Row, Modal, Form } from "react-bootstrap";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import Swal from "sweetalert2"; // Import SweetAlert
import { useRouter } from "next/router";
import Image from "next/image";

// main

export default function CheckOutComponents({
  userId,
  eventId,
  handleModalClose,
  showNextStep,
  couponDetails,
  adminFees,
  donationFees,
  propertyDetails,
  nights,
  bookingDates,
  selectedPaymentOption,
  totalAmountToBePay,
  taxesInfo,
  accommodationTaxes,
  eventHousingId
}) {
  let stripePromise;
  if (userId == 10272) {
    stripePromise = loadStripe(process.env.STRIPE_DEV_PUBLIC_KEY);
  } else {
    stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);
  }

  const router = useRouter();

  // console.log('-------------------propertyDetails', propertyDetails);

  // Loading Component
  const LoadingComponent = ({ isActive }) =>
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
  const [isHousingAvailable, setIsHousingAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const [cart, setCart] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [currencyName, setCurrencyName] = useState("");
  const [eventImage, setEventImage] = useState(null);

  // Fetch Cart Details
  const fetchCartDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`/api/v1/front/cart?userId=${userId}`);
      const cartData = data?.data || [];

      setCart(cartData);

      if (cartData.length > 0 && cartData[0]?.Event?.Currency?.Currency_symbol) {
        setCurrencySymbol(cartData[0].Event.Currency.Currency_symbol);
        setCurrencyName(cartData[0].Event.Currency.Currency);
        setEventImage(cartData[0].Event.ImageURL);
      } else {
        // Fetch event details separately if cart is empty
        const eventRes = await axios.get(`/api/v1/front/event/events?key=event_details&eventId=${eventId}`
        );
        const eventData = eventRes?.data?.data;

        if (eventData?.Currency) {
          setCurrencySymbol(eventData.Currency.Currency_symbol);
          setCurrencyName(eventData.Currency.Currency);
          setEventImage(eventData.ImageURL);
        }

      }
    } catch (error) {
      console.error("Failed to fetch cart or event details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ✅ Check function
  const checkAccommodationAvailability = async (propertyId, eventId) => {
    if (!propertyId || !eventId) return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `/api/v1/housings/?action=isAccommodationAssigned&housingId=${propertyId}&eventId=${eventId}`
      );

      if (response.data?.success === false) {
        showNextStep(false); // prevent moving forward
        await Swal.fire({
          icon: "warning",
          title: "Warning",
          text: response.data.message || "Housing is already booked.",
          confirmButtonText: "OK",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        });
        router.push({ pathname: "/accommodations" });
        setIsHousingAvailable(false);
        return false; // explicitly return false
      }

      setIsHousingAvailable(true);
      return true; // explicitly return true

    } catch (error) {
      console.error("Error checking accommodation:", error);
      setIsHousingAvailable(false);

      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to check accommodation availability.",
        confirmButtonText: "OK",
        customClass: {
          popup: "add-tckt-dtlpop",
        },
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const roundWithThreshold = (amount, threshold = 0.40) => {
    const floor = Math.floor(amount);
    const decimal = amount - floor;
    const rounded = decimal >= threshold ? Math.ceil(amount) : floor;
    return rounded;
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (propertyDetails?.id && eventId) {
        await checkAccommodationAvailability(propertyDetails.id, eventId);
      }
    };

    checkAvailability(); // call the async function
  }, [propertyDetails, eventId]);


  const calculateTotalsV2 = (
    cart = [],
    discountAmount = 0,
    propertyDetails = null,
    nights = 0,
    selectedPaymentOption = "full", // "partial" or "full"
    taxesInfo = {}
  ) => {
    let totalTicketPrice = 0;
    let totalAddonPrice = 0;

    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    const {
      ticket_platform_fee_percentage = 0,
      ticket_stripe_fee_percentage = 0,
      ticket_bank_fee_percentage = 0,
      ticket_processing_fee_percentage = 0
    } = taxesInfo;

    const adminFeeDecimal =
      (ticket_platform_fee_percentage +
        ticket_bank_fee_percentage +
        ticket_processing_fee_percentage) /
      100;

    const stripeFeeDecimal = ticket_stripe_fee_percentage / 100;

    // 1. Ticket + Addon total
    cart.forEach((item) => {
      const price =
        item.ticket_type == "ticket"
          ? item.EventTicketType?.price || 0
          : item.Addon?.price || 0;

      const quantity = item.no_tickets || 1;

      if (item.ticket_type == "ticket") {
        totalTicketPrice += price * quantity;
      } else {
        totalAddonPrice += price * quantity;
      }
    });

    const totalTicketAndAddonPrice = totalTicketPrice + totalAddonPrice;
    const discountedTicketTotal = round2(
      Math.max(totalTicketPrice - discountAmount, 0)
    );
    const discountedAddonTotal = round2(totalAddonPrice);
    const discountedTicketAndAddon = discountedTicketTotal + discountedAddonTotal;

    const nightlyRateWithTaxes = Number(
      propertyDetails?.EventHousings?.[0]?.NightlyPrice || 0
    );

    // 2. Accommodation total (from propertyDetails)
    const nightlyRate = Number(
      propertyDetails?.EventHousings?.[0]?.totalAfterTaxes || 0
    );

    const totalAccommodationPrice = Math.round(nightlyRate * nights);

    const totalAccommodationBase = Number(
      propertyDetails?.EventHousings?.[0]?.totalAfterTaxes || 0
    );

    // Accommodation pricing details 
    const basePriceHousing = Number(
      propertyDetails?.EventHousings?.[0]?.BaseNightlyPrice || 0
    );
    const accommodationServiceFeeAmount = Number(
      propertyDetails?.EventHousings?.[0]?.ServiceFeeAmount || 0
    );
    const accommodationMexicanVATAmount = Number(
      propertyDetails?.EventHousings?.[0]?.MexicanVATAmount || 0
    );
    const accomTaxAmount = Number(
      propertyDetails?.EventHousings?.[0]?.AccommodationTaxAmount || 0
    );
    const ondalindaFeeAmount = Number(
      propertyDetails?.EventHousings?.[0]?.OndalindaFeeAmount || 0
    );
    const totalAfterTaxes = Number(
      propertyDetails?.EventHousings?.[0]?.totalAfterTaxes || 0
    );
    const propertyOwnerAmount = Number(
      propertyDetails?.EventHousings?.[0]?.OwnerAmount || 0
    );
    const totalAccommodationBasePrice = Math.round(
      totalAccommodationBase * nights
    );

    // 3. Admin Fee Calculation
    const ticketPlatformFee = round2(
      discountedTicketTotal * (ticket_platform_fee_percentage / 100)
    );
    const ticketBankFee = round2(
      discountedTicketTotal * (ticket_bank_fee_percentage / 100)
    );
    const ticketProcessingFee = round2(
      discountedTicketTotal * (ticket_processing_fee_percentage / 100)
    );
    const addonPlatformFee = round2(
      discountedAddonTotal * (ticket_platform_fee_percentage / 100)
    );
    const addonBankFee = round2(
      discountedAddonTotal * (ticket_bank_fee_percentage / 100)
    );
    const addonProcessingFee = round2(
      discountedAddonTotal * (ticket_processing_fee_percentage / 100)
    );
    const accommodationBankFee = round2(
      totalAccommodationBasePrice * (ticket_bank_fee_percentage / 100)
    );
    const accommodationProcessingFee = round2(
      totalAccommodationBasePrice * (ticket_processing_fee_percentage / 100)
    );

    // Admin totals per category
    const ticketAdminTotal =
      ticketPlatformFee + ticketBankFee + ticketProcessingFee;
    const addonAdminTotal = addonPlatformFee + addonBankFee + addonProcessingFee;
    const accommodationAdminTotal =
      accommodationBankFee + accommodationProcessingFee;

    // 4. Stripe Fee Proportion
    const totalBeforeStripe = round2(
      discountedTicketAndAddon +
      ticketAdminTotal +
      addonAdminTotal +
      accommodationAdminTotal
    );
    const customerPays = roundWithThreshold(Math.round(totalBeforeStripe / (1 - stripeFeeDecimal)));
    const ticketPortion = discountedTicketTotal + ticketAdminTotal;
    const addonPortion = discountedAddonTotal + addonAdminTotal;
    const accommodationPortion = totalAccommodationBasePrice + accommodationAdminTotal;
    const totalPortion = ticketPortion + addonPortion + accommodationPortion || 1;

    // === Stripe Fees ===
    const calculateStripeFee = (amountWithAdminFee) => {
      const customerPays = round2(amountWithAdminFee / (1 - stripeFeeDecimal));
      const stripeFee = round2(customerPays * stripeFeeDecimal);
      return stripeFee;
    };

    const ticketStripeFee = ticketPortion > 0 ? calculateStripeFee(ticketPortion) : 0;
    const addonStripeFee = addonPortion > 0 ? calculateStripeFee(addonPortion) : 0;
    const accommodationStripeFee = accommodationPortion > 0 ? calculateStripeFee(accommodationPortion) : 0;

    // 5. Tax Totals
    const ticketTax = ticketAdminTotal + ticketStripeFee;
    const addonTax = addonAdminTotal + addonStripeFee;
    const accommodationTax = accommodationAdminTotal + accommodationStripeFee;


    const isPartial = selectedPaymentOption == "partial";
    const partialAccommodationAmount = roundWithThreshold(Math.round(totalAccommodationPrice / 2));
    const partialAccommodationTax = roundWithThreshold(Math.round(accommodationTax / 2));
    const partialFinalAmount = roundWithThreshold(Math.round(discountedTicketAndAddon + ticketTax + addonTax + partialAccommodationAmount + partialAccommodationTax));
    const partialAccommodationWithTax = roundWithThreshold(Math.round(partialAccommodationAmount + partialAccommodationTax));

    const totalTax = roundWithThreshold(ticketTax + addonTax + accommodationTax);

    // 6. Final Amounts
    const fullFinalAmount = roundWithThreshold(Math.round(discountedTicketAndAddon +
      totalAccommodationPrice + totalTax));

    // === Total Tax Components ===
    // const totalBankFee = round2(ticketBankFee + addonBankFee + accommodationBankFee);
    // const totalPlatformFee = round2(ticketPlatformFee + addonPlatformFee);
    // const totalProcessingFee = round2(ticketProcessingFee + addonProcessingFee + accommodationProcessingFee);
    // const totalStripeFee = round2(ticketStripeFee + addonStripeFee + accommodationStripeFee);

    const totalBankFee = round2(ticketBankFee + addonBankFee);
    const totalPlatformFee = round2(ticketPlatformFee + addonPlatformFee);
    const totalProcessingFee = round2(ticketProcessingFee + addonProcessingFee);
    const totalStripeFee = round2(ticketStripeFee + addonStripeFee);

    const payableAmount = roundWithThreshold(isPartial ? partialFinalAmount : fullFinalAmount);
    const partialPayableTax = roundWithThreshold(Math.round(ticketTax + addonTax + partialAccommodationTax));

    const totalAccommodationPriceWithTaxes = Math.round(totalAccommodationPrice + accommodationTax);

    return {
      breakdown: {
        fees: {
          ticket: {
            platform: ticketPlatformFee,
            bank: ticketBankFee,
            processing: ticketProcessingFee,
            stripe: ticketStripeFee,
            total: ticketTax
          },
          addon: {
            platform: addonPlatformFee,
            bank: addonBankFee,
            processing: addonProcessingFee,
            stripe: addonStripeFee,
            total: addonTax
          },
          accommodationPaymentBreakdown: {
            nights,
            basePriceHousing,
            accommodationServiceFeeAmount,
            accommodationMexicanVATAmount,
            accomTaxAmount,
            ondalindaFeeAmount,
            totalAfterTaxes,
            propertyOwnerAmount,
            nightlyRate,
            accommodationBankFee,
            accommodationProcessingFee,
            accommodationStripeFee
          },
          accommodation: {
            bank: accommodationBankFee,
            processing: accommodationProcessingFee,
            stripe: accommodationStripeFee,
            total: accommodationTax
          },
        },
        ticketTaxBreakdown: {
          totalTax,
          ticketPlatformFee: totalPlatformFee,
          ticketStripeFee: totalStripeFee,
          ticketBankFee: totalBankFee,
          ticketProcessingFee: totalProcessingFee,
          nights,
          accommodation_basePerDaysPriceHousing: basePriceHousing,
          accommodationPerDaysPropertyOwnerAmount: propertyOwnerAmount,
          accommodation_nightlyPerDaysRate: nightlyRateWithTaxes,
          accommodationOndalindaPerDaysTotalAfterTaxes: totalAfterTaxes,
          accommodationPerDaysServiceFeeAmount: accommodationServiceFeeAmount,
          accommodationPerDaysMexicanVATAmount: accommodationMexicanVATAmount,
          accommodationPerDaysTaxAmount: accomTaxAmount,
          accommodationOndalindaPerDaysFeeAmount: ondalindaFeeAmount,
          accommodationBankFee,
          accommodationProcessingFee,
          accommodationStripeFee
        },
        ticketTotal: totalTicketPrice,
        addonTotal: totalAddonPrice,
        accommodationTotal: totalAccommodationPriceWithTaxes,
        ticketTax,
        addonTax,
        accommodationTax,
        halfAccommodation: partialAccommodationWithTax,
        ticketingFeeDetails: taxesInfo,
        totalTicketPrice,
        totalAddonPrice,
        totalAccommodationPriceWithTaxes,
        nightlyRateWithTaxes,
        totalAccommodationBasePrice,
        totalTicketAndAddonPrice,
        partialAccommodationWithTax,
        ticket: discountedTicketTotal,
        addon: discountedAddonTotal,
        totalAccommodationPrice,
        finalAmount: fullFinalAmount,
        totalTax,
        partialPayableTax,
        partialAmount: isPartial ? partialFinalAmount : 0,
        payableAmount,
        partialPayableAmount: partialFinalAmount,
        partialAccommodationAmount,
        partialAccommodationTax,
        nights,
        basePriceHousing,
        accommodationServiceFeeAmount,
        accommodationMexicanVATAmount,
        accomTaxAmount,
        ondalindaFeeAmount,
        totalAfterTaxes,
        propertyOwnerAmount,
        nightlyRate,
        discountAmount
      }
    };
  };

  const { breakdown } = calculateTotalsV2(
    cart,
    couponDetails?.discountAmt,
    propertyDetails,
    nights,
    selectedPaymentOption,
    taxesInfo
  );

  const {
    totalTicketAndAddonPrice,
    accommodationTotal,
    totalTax,
    totalAccommodationBasePrice,
    finalAmount,
    payableAmount,
    partialPayableTax,
    partialAccommodationWithTax,
    totalAccommodationPrice,
    totalAccommodationPriceWithTaxes,
    discountAmount
  } = breakdown;

  // console.log('>>>>>>>>>>>>>>>>>???', breakdown);

  function formatSmartPrice(amount) {
    if (isNaN(amount)) return "Invalid amount";

    const isInteger = Number(amount) % 1 === 0;
    const formatted = isInteger
      ? Number(amount).toLocaleString()               // No decimals
      : Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return formatted;
  }

  // Fetch Member Profile
  const fetchMemberProfile = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/v1/front/users?id=${userId}`);
      return data?.data || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }, [userId]);


  // payment intent create 
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setIsLoading(true);

        const user = await fetchMemberProfile();
        if (!user) return;

        const { data } = await axios.post("/api/v1/create-payment-intent-accommodation", {
          userId,
          eventId,
          firstName: user.FirstName,
          lastName: user.LastName,
          email: user.Email,
          currency: currencyName,
          selectedPaymentOption,
          adminFees,
          finalPrice: finalAmount,
          amount: payableAmount,
          totalTax: selectedPaymentOption == "partial" ? partialPayableTax : totalTax,
          partialPayableTax,
          roundedAccomoTotalAmount: totalAccommodationPriceWithTaxes,
          donationFees,
          bookingDates,
          couponDetails,
          breakdown,
          cart,
          propertyDetails,
          nights
        });

        setClientSecret(data.clientSecret);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong while processing the payment",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        }).then(() => {
          showNextStep(false);
        });

        console.error("Error creating payment intent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (
      isHousingAvailable && // ✅ wait until housing confirmed
      !isLoading &&
      payableAmount > 0 &&
      currencyName &&
      propertyDetails
    ) {
      fetchClientSecret();
    }
  }, [
    isHousingAvailable, // 🧠 now depends on this
    payableAmount,
    currencyName,
    eventId,
    userId,
    couponDetails,
    adminFees,
    fetchMemberProfile
  ]);

  // Fetch cart details on component mount
  useEffect(() => {
    fetchCartDetails();
  }, [fetchCartDetails]);

  return (
    <>
      <Modal.Header>
        <Button className="py-0" onClick={() => showNextStep(false)}>
          <img
            alt=""
            className="wd-25"
            src={`/assets/img/front-images/caryes-ticket-lft-arow.png`}
          />
        </Button>

        <Button
          onClick={handleModalClose}
          className="btn-close ms-auto"
          variant=""
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </Modal.Header>

      <Modal.Body className="px-3 care-new-check-secnd care-accom-scd-flw">
        <>
          <LoadingComponent isActive={isLoading} />

          <div className="secon-flw">
            <Row className="mrgn-ck-x">
              <Col md={7} className="crt-pdng-x">
                <div
                  className="scd-hd-img monte-snd-bnr"
                  style={{
                    background: `url(${process.env.NEXT_PUBLIC_S3_URL}/profiles/${eventImage && eventImage ? eventImage : "no-image-1.png"
                      })`,
                  }}
                >
                  {/* <h2>
                    O<span>x</span>MONTENEGRO
                  </h2> */}

                  <img src={`/assets/img/brand/white-logo.svg`} alt="Logo" />
                </div>
              </Col>
              <Col md={5} className="crt-pdng-x">
                <div className="scd-hd-cnt">
                  <div className="text-center">
                    <h2 className="ck-mn-hd">OxCareyes</h2>
                    <p>November 6 - 9, 2025</p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="scnd-flw-amnts">
            <h3>YOUR TICKETS </h3>

            <Row className="align-items-end mrgn-ck-x justify-content-between">
              {/* tickets name with price  */}
              <Col xl={5} md={6} className="crt-pdng-x">
                <div className="amnt-stl-inr">
                  {cart &&
                    cart.map((element, index) => {
                      return (
                        <div className="tct-amt" key={index}>
                          <p>
                            {element.no_tickets}x{" "}
                            <span className="stp2-monte25-nm">
                              {element.ticket_type == "ticket" &&
                                element.EventTicketType
                                ? element.EventTicketType.title
                                : element.Addon
                                  ? element.Addon.name
                                  : "Unknown"}
                            </span>
                          </p>
                          <span className="stp2-monte25-nm">
                            {" "}
                            {currencySymbol}
                            {element.ticket_type == "ticket" &&
                              element.EventTicketType
                              ? formatSmartPrice(
                                element.EventTicketType.price *
                                element.no_tickets
                              )
                              : element.ticket_type == "addon" && element.Addon
                                ? formatSmartPrice(
                                  element.Addon.price * element.no_tickets
                                )
                                : 0}
                          </span>
                        </div>
                      );
                    })}

                  {propertyDetails && (
                    <div className="tct-amt" key={propertyDetails.id}>
                      <p>
                        {nights}x{" "} NIGHTS {" "}
                        <span className="stp2-monte25-nm">
                          {propertyDetails?.Name}, {propertyDetails?.HousingNeighborhood.name}
                        </span>
                      </p>
                      <span className="stp2-monte25-nm">
                        {" "}
                        {currencySymbol}
                        {formatSmartPrice(totalAccommodationBasePrice)}
                      </span>
                    </div>
                  )}
                </div>
              </Col>

              {/* total ticket price and taxes */}
              <Col xl={5} md={6} className="crt-pdng-x">
                <div className="amnt-stl-inr">
                  {
                    totalTicketAndAddonPrice > 0 && (
                      <div className="tct-amt">
                        <p>TICKETS: </p>
                        <span>
                          {currencySymbol}
                          {formatSmartPrice(totalTicketAndAddonPrice)}
                        </span>
                      </div>

                    )
                  }
                  <div className="tct-amt">
                    <p>ACCOMMODATION:</p>{" "}
                    <span>
                      {currencySymbol}
                      {formatSmartPrice(totalAccommodationBasePrice)}
                    </span>
                  </div>

                  {totalTax > 0 && (
                    <div className="tct-amt">
                      <p>TAXES & FEES:</p>{" "}
                      <span>
                        {currencySymbol}
                        {formatSmartPrice(totalTax)}
                      </span>
                    </div>
                  )}


                </div>
              </Col>
            </Row>

            {/* Total Price */}
            <Row className="ttl-amts justify-content-between">
              <Col xl={5} md={6} />
              <Col xl={5} md={6} className="crt-pdng-x">

                {/* Coupon / Discount Line */}
                {couponDetails && (
                  <div className="tct-amt mb-2">
                    <p><strong>STAFF ID DISCOUNT:</strong></p>
                    <span className="text-success">
                      {couponDetails.discount_type == "percentage" ? (
                        <>- {Math.floor(couponDetails.discount_value)}% ({currencySymbol}{formatSmartPrice(discountAmount)})</>
                      ) : (
                        <>
                          -{" "}
                          {currencySymbol || ""}
                          {formatSmartPrice(discountAmount)}
                        </>
                      )}
                    </span>
                  </div>
                )}

                {/* Always show total amount */}
                <div className="tct-amt mb-2">
                  <p><strong>TOTAL AMOUNT:</strong></p>
                  <p className="text-dark fw-semibold" style={{ fontSize: "1rem" }}>
                    {currencySymbol}
                    {formatSmartPrice(finalAmount)}
                  </p>
                </div>

                {/* Payment split for half option */}
                {selectedPaymentOption == "partial" ? (
                  <>
                    <div className="tct-amt mb-2">
                      <p><strong>PARTIAL PAY:</strong></p>
                      <p className="text-primary fw-bold" style={{ fontSize: "1rem" }}>
                        {currencySymbol}
                        {formatSmartPrice(payableAmount)}
                      </p>
                    </div>

                    <div className="tct-amt">
                      <p><strong>REMAINING ACCOMMODATION BALANCE (INCLUSIVE TAX)</strong></p>
                      <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                        {currencySymbol}
                        {formatSmartPrice(partialAccommodationWithTax)}
                      </p>
                    </div>

                  </>
                ) : (
                  <div className="tct-amt mt-2">
                    <p><strong>AMOUNT TO PAY NOW:</strong></p>
                    <p className="text-primary fw-bold" style={{ fontSize: "1rem" }}>
                      {currencySymbol}
                      {formatSmartPrice(finalAmount)}
                    </p>
                  </div>
                )}
              </Col>
            </Row>


          </div>
          {clientSecret && (
            <CheckoutForm
              clientSecret={clientSecret}
              stripePromise={stripePromise}
              userId={userId}
              showNextStep={showNextStep}
              finalPriceAfterDiscount={payableAmount}
            />
          )}
        </>
      </Modal.Body>
    </>
  );
}
