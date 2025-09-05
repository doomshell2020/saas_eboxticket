import Head from "next/head";
import { Inter } from "next/font/google";
 
import CryptoJS from "crypto-js";
import {
  Alert,
  Button,
  Col,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  FormGroup,
  InputGroup,
  Row,
  Tab,
  Tabs,
  Modal,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Seo from "@/shared/layout-components/seo/seo";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import CheckOutComponent from "./CheckOut";
// import Moment from "react-moment";
import moment from "moment-timezone";
import Image from "next/image";

const LoadingComponent = ({ isActive }) => {
  return (
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
          borderRadius: "27px",
        }}
      >
        <span
          className="fas fa-spinner fa-3x fa-spin"
          style={{ color: "black" }}
        ></span>
      </div>
    )
  );
};

export default function Cart({
  isActiveNow,
  makeModalOff,
  propertyId,
  userId,
  eventId,
  eventHousingId,
  requiredTickets
}) {

  const [show, setShow] = useState(isActiveNow);
  const [isLoading, setIsLoading] = useState(false); // State to control loading spinner
  const [eventDetails, setEventDetails] = useState({}); // console.log(UserID);
  const [currencySymbol, setCurrencySymbol] = useState(null); // console.log(UserID);
  const [partial_payment_duration_days_count, set_partial_payment_duration] =
    useState(0);
  const [
    partial_payment_duration_last_date,
    set_partial_payment_duration_last_date,
  ] = useState("");
  const [addonsDetailsArray, setAddonsDetailsArray] = useState([]); // console.log(UserID);
  const [cartModalShow, setCartModalShow] = useState(false);
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccessMessage, setCouponSuccessMessage] = useState("");
  const [couponDetails, setCouponDetails] = useState("");
  const [adminFees, setAdminFees] = useState(0);
  const [accommodationTaxes, setAccommodationTaxes] = useState(0);
  const [ticketingFeeDetails, setTicketingFeeDetails] = useState();
  const [donationFees, setDonationFees] = useState(0);
  const [propertyDetails, setPropertyDetails] = useState(null);
  // console.log('>>>>>>>>>',propertyDetails);

  // 👉 Add these new states for bookingParams
  const [bookingParams, setBookingParams] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [nights, setNights] = useState(0);
  const [minOccupancy, setMinOccupancy] = useState(0);
  const [maxOccupancy, setMaxOccupancy] = useState(0);
  const [bookingDates, setBookingDates] = useState({
    arrivalDate: "",
    departureDate: "",
  });
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [isPartialPaymentEligible, setIsPartialPaymentEligible] =
    useState(false);
  const [
    partialPaymentEligibleBaseAmount,
    setPartialPaymentEligibleBaseAmount,
  ] = useState(10000);

  // console.log("======", dateRange);

  const isSaleActive = (saleStartDate, saleEndDate) => {
    if (!saleStartDate || !saleEndDate) {
      console.error("Invalid input: Missing sale start date or end date");
      return false;
    }

    // Validate the timezone
    if (!moment.tz.zone(eventDetails.EventTimeZone)) {
      console.error("Invalid timezone:", eventDetails.EventTimeZone);
      return false;
    }

    const currentDate = moment().tz(eventDetails.EventTimeZone);
    const startDate = moment.tz(saleStartDate, eventDetails.EventTimeZone);
    const endDate = moment
      .tz(saleEndDate, eventDetails.EventTimeZone)
      .endOf("day"); // 👈 Make endDate last till 11:59:59 PM

    if (!startDate.isValid() || !endDate.isValid()) {
      console.error("Invalid date format for sale start or end date");
      return false;
    }

    // console.log("Current Date:", currentDate.format("YYYY-MM-DD h:mm:ss a z"));
    // console.log("Sale End Date:", endDate.format("YYYY-MM-DD h:mm:ss a z"));

    return (
      currentDate.isSameOrAfter(startDate) &&
      currentDate.isSameOrBefore(endDate)
    );
  };

  // Handle change in payment option selection
  const handlePaymentOptionChange = (event) => {
    setSelectedPaymentOption(event.target.value);
  };

  const navigate = useRouter();

  function formatSmartPrice(amount) {
    if (isNaN(amount)) return "Invalid amount";

    const isInteger = Number(amount) % 1 === 0;
    const formatted = isInteger
      ? Number(amount).toLocaleString() // No decimals
      : Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    return formatted;
  }


  // formate date times for accommodations
  useEffect(() => {
    const storedBookingParams = localStorage.getItem("bookingParams");
    if (storedBookingParams) {
      const parsed = JSON.parse(storedBookingParams);
      setBookingParams(parsed);

      const formatDateRangeAndNights = (arrivalStr, departureStr) => {
        const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        // Break into parts
        const [ay, am, ad] = arrivalStr.split("-").map(Number);
        const [dy, dm, dd] = departureStr.split("-").map(Number);

        // console.log('ay, am, ad',ay, am, ad);
        // console.log('dy, dm, dd',dy, dm, dd);

        // Use only the date, not time or timezone
        const arrival = new Date(ay, am - 1, ad);
        const departure = new Date(dy, dm - 1, dd);

        // console.log('arrival', arrival);
        // console.log('departure', departure);

        const dayFrom = weekdays[arrival.getDay()];
        const dayTo = weekdays[departure.getDay()];
        const month = months[am - 1];
        const year = ay;

        const formattedRange = `${dayFrom}-${dayTo}, ${month} ${ad}-${dd}, ${year}`;

        const diffTime = departure.getTime() - arrival.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        return {
          formattedRange,
          nights: diffDays,
          bookingDates: {
            arrivalDate: arrivalStr,
            departureDate: departureStr
          }
        };
      };


      const {
        formattedRange,
        nights,
        bookingDates
      } = formatDateRangeAndNights(parsed.ArrivalDate, parsed.DepartureDate);

      setBookingDates(bookingDates);
      setDateRange(formattedRange);
      setNights(nights);
    }
  }, []);


  useEffect(() => {
    if (propertyDetails) {
      const bedrooms = propertyDetails.NumBedrooms || 0;
      const minOccupancyValue = bedrooms >= 4 ? 4 : bedrooms;
      setMinOccupancy(minOccupancyValue);
      setMaxOccupancy(propertyDetails.MaxOccupancy);
    }
  }, [propertyDetails]);

  useEffect(() => {
    setShow(isActiveNow);
  }, [isActiveNow]);

  useEffect(() => {
    // if (propertyId && !propertyDetails) {
    if (propertyId) {
      fetchPropertyDetails();
    }
  }, [propertyId]);

  const fetchPropertyDetails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/front/accommodationbook/bookaccommodations/?key=info&property_id=${propertyId}&EventID=${eventId}`
        // `/api/v1/front/accommodationbook/bookaccommodations/?key=info&property_id=359&EventID=${eventId}`

      );

      if (response.data.success) {
        const propertyData = { ...response.data.data };
        setPropertyDetails(propertyData);
      } else {
        setErrorMessage("No property details found.");
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
      setErrorMessage("Error :" + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear messages after 5 seconds
  const clearMessages = () => {
    setTimeout(() => {
      setErrorMessage("");
      setSuccessMessage("");
      // setCouponError("");
      // setCouponSuccessMessage("");
    }, 10000); // Clear after 5 seconds
  };

  const fetchEventDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/events?key=event_details&id=${eventId}`
      );
      const eventData = response?.data?.data;

      if (eventData?.eventDetails) {
        setEventDetails(eventData.eventDetails);
        const currencySymbol =
          eventData?.eventDetails?.Currency?.Currency_symbol || null;
        setCurrencySymbol(currencySymbol);
        setAddonsDetailsArray(eventData.addonCountResults || []);
        // Parse fees safely with fallback to 0
        const donationFee =
          parseFloat(eventData.eventDetails.donation_fees) || 0;

        const ticket_platform_fee_percentage =
          parseFloat(eventData.eventDetails.ticket_platform_fee_percentage) ||
          0;
        const ticket_stripe_fee_percentage =
          parseFloat(eventData.eventDetails.ticket_stripe_fee_percentage) || 0;
        const ticket_bank_fee_percentage =
          parseFloat(eventData.eventDetails.ticket_bank_fee_percentage) || 0;
        const ticket_processing_fee_percentage =
          parseFloat(eventData.eventDetails.ticket_processing_fee_percentage) ||
          0;

        setTicketingFeeDetails({
          ticket_platform_fee_percentage,
          ticket_stripe_fee_percentage,
          ticket_bank_fee_percentage,
          ticket_processing_fee_percentage,
        });

        setAdminFees(
          ticket_platform_fee_percentage +
          ticket_stripe_fee_percentage +
          ticket_bank_fee_percentage +
          ticket_processing_fee_percentage
        );
        setAccommodationTaxes(
          ticket_stripe_fee_percentage +
          ticket_bank_fee_percentage +
          ticket_processing_fee_percentage
        );
        setDonationFees(donationFee);
        set_partial_payment_duration(
          eventData.eventDetails.partial_payment_duration || 0
        );
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const fetchCartDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/v1/front/cart?userId=${userId}`);
      const { data } = response;
      if (data && data.data) {
        setCart(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cart details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const fetchAdminFees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/v1/users/?key=admin_fee");
      const { data } = response;
      if (data && data.data) {
        // setAdminFees(data.data.admin_fees);
        setDonationFees(data.data.donation_fees);
      }
    } catch (error) {
      console.error("Failed to fetch admin fees:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize event details, cart details, and fees data to avoid unnecessary rerenders
  const memoizedEventDetails = useMemo(() => eventDetails, [eventDetails]);
  const memoizedCart = useMemo(() => cart, [cart]);
  const memoizedAdminFees = useMemo(
    () => ({ adminFees, donationFees }),
    [adminFees, donationFees]
  );

  useEffect(() => {
    document.body.classList.add("front-design");
    fetchEventDetails();
    fetchCartDetails();
    // fetchAdminFees();
    return () => {
      document.body.classList.remove("front-design");
    };
  }, [fetchEventDetails, fetchCartDetails]);

  const handleModalClose = () => {
    makeModalOff(false);
    // setShowNextStep(false);
    setShow(false);
  };

  // const getTotalCartCount = () => {
  //   return cart.reduce((sum, item) => sum + (item.no_tickets || 0), 0);
  // };

  const getTotalCartCount = () => {
    return cart
      .filter((item) => item.ticket_type == "ticket") // Only include items of type "ticket"
      .reduce((sum, item) => sum + (item.no_tickets || 0), 0);
  };
  let minLimit;
  const handleApiCall = async (ticketId, type, symbol) => {
    try {
      const totalTickets = getTotalCartCount();

      // Always safe and consistent
      // const requiredTicketsCount = Number(requiredTickets);
      // if (requiredTicketsCount == 0) {
      //   minLimit = 0;
      // } else if (requiredTicketsCount > 0) {
      //   minLimit = requiredTicketsCount;
      // } else {
      //   minLimit = minOccupancy >= 4 ? 4 : minOccupancy;
      // }

      let requiredTicketsCount;
      if (requiredTickets == null || requiredTickets == undefined) {
        // If requiredTickets is null or undefined, use fallback
        minLimit = minOccupancy >= 4 ? 4 : minOccupancy;
      } else {
        requiredTicketsCount = Number(requiredTickets);
        if (requiredTicketsCount === 0) {
          minLimit = 0;
        } else if (requiredTicketsCount > 0) {
          minLimit = requiredTicketsCount;
        } else {
          minLimit = minOccupancy >= 4 ? 4 : minOccupancy;
        }
      }

      // ✅ Check for "+" (increase) => cannot exceed max
      if (type === "ticket" && symbol === "+" && totalTickets >= maxOccupancy) {
        // alert(`You can't exceed the max occupancy limit of ${maxOccupancy}.`);
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: `You can't exceed the max occupancy limit of ${maxOccupancy}.`,
          confirmButtonText: "OK",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        });
        return;
      }

      // ✅ Check for "-" (decrease) => cannot go below minLimit
      if (type === "ticket" && symbol === "-" && (totalTickets - 1) < minLimit) {
        // alert(`You must select at least ${minLimit} tickets.`);
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: `You must select at least ${minLimit} tickets.`,
          confirmButtonText: "OK",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        });
        return;
      }


      // if (type == "ticket" && symbol === "+" && totalTickets >= maxOccupancy) {
      //   alert(`You can't exceed the max occupancy limit of ${maxOccupancy}.`);
      //   return;
      // }

      // if (type == "ticket" && symbol === "-" && totalTickets <= minOccupancy) {
      //   alert(`You must select at least ${minOccupancy} tickets.`);
      //   return;
      // }

      const response = await axios.post("/api/v1/front/cart", {
        userId: userId,
        eventId,
        ticketId: ticketId,
        ticket_type: type,
        symbol,
      });

      if (coupon) {
        await handleApplyCoupon();
      }

      if (!response.data.success) {
        setErrorMessage(response.data.message || "Something went wrong");
        setSuccessMessage("");
      } else {
        setSuccessMessage(response.data.message);
        setErrorMessage(""); // Clear error message if any
      }

      if (response.data.data.length == 0) {
        // if cart is empty then we reset coupon
        setCoupon("");
        setCouponError("");
        setCouponSuccessMessage("");
        setCouponDetails("");
      }

      setCart(response.data.data);
      clearMessages(); // Start timer to clear message
    } catch (error) {
      console.error("Error calling API:", error.message);
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear success message if any
      clearMessages(); // Start timer to clear message
    }
  };

  const handleIncrement = async (ticketId, type) => {
    setIsLoading(true); // Start loading spinner
    await handleApiCall(ticketId, type, "+");
    setIsLoading(false);
  };

  const handleDecrement = async (ticketId, type) => {
    setIsLoading(true);
    await handleApiCall(ticketId, type, "-");
    setIsLoading(false);
  };

  const handleDeleteCartItem = async (cartId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        customClass: {
          popup: "add-tckt-dtlpop",
        }
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const response = await axios.get(
          "/api/v1/front/cart?action=delete_cart_item",
          {
            params: { cartId },
          }
        );

        if (!response.data.success) {
          setErrorMessage(response.data.message || "Something went wrong");
          setSuccessMessage("");
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.data.message,
          });
        } else {
          setSuccessMessage(response.data.message);
          setErrorMessage("");
          Swal.close();
        }
        await fetchCartDetails();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      setErrorMessage(error.message);
      setSuccessMessage(""); // Clear success message if any
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
      await fetchCartDetails();
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    setIsLoading(true);
    if (!coupon) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/v1/validate-coupon", {
        params: {
          couponCode: coupon,
          action: "is_valid",
          userId,
          eventId,
        },
      });
      if (response.data.success) {
        setCouponDetails(response.data.data);
        setCouponSuccessMessage(response.data.message);
        setCouponError("");
        localStorage.setItem("couponCode", coupon);
      } else {
        setCouponError(response.data.message || "Invalid coupon code.");
        setCouponSuccessMessage("");
      }
      // clearMessages();
      setIsLoading(false);
    } catch (error) {
      console.error("Error applying coupon:", error.message);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while applying the coupon.";
      setCouponError(errorMessage);
      setCouponSuccessMessage("");
      // clearMessages();
      setIsLoading(false);
    }
  };

  const checkAccommodationAvailability = async (propertyId, eventId) => {
    try {
      const response = await axios.get(`/api/v1/housings/?action=isAccommodationAssigned&housingId=${propertyId}&eventId=${eventId}`);

      if (response.data?.success === false) {
        await Swal.fire({
          icon: "warning",
          title: "Warning",
          text: response.data.message || "Housing is already booked.",
          confirmButtonText: "OK",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        });
        return false;
      }

      return true; // Housing is available
    } catch (error) {
      console.error("Error checking accommodation:", error);
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
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponDetails("");
    setCoupon("");
    setCouponError("");
    setCouponSuccessMessage("");
    // localStorage.removeItem("couponCode");
  };


  const roundWithThreshold = (amount, threshold = 0.40) => {
    const floor = Math.floor(amount);
    const decimal = amount - floor;
    const rounded = decimal >= threshold ? Math.ceil(amount) : floor;
    return rounded;
  };


  const calculateTotalsV2 = (
    cart = [],
    discountAmount = 0,
    propertyDetails = null,
    nights = 0,
    selectedPaymentOption = "full", // "partial" or "full"
    ticketingFeeDetails = {}
  ) => {
    let totalTicketPrice = 0;
    let totalAddonPrice = 0;

    const round2 = (num) => Math.round((num + Number.EPSILON) * 100) / 100;

    const {
      ticket_platform_fee_percentage = 0,
      ticket_stripe_fee_percentage = 0,
      ticket_bank_fee_percentage = 0,
      ticket_processing_fee_percentage = 0
    } = ticketingFeeDetails;

    const adminFeeDecimal =
      (ticket_platform_fee_percentage +
        ticket_bank_fee_percentage +
        ticket_processing_fee_percentage) /
      100;

    const stripeFeeDecimal = ticket_stripe_fee_percentage / 100;

    // 1. Ticket + Addon total
    cart.forEach((item) => {
      const price =
        item.ticket_type === "ticket"
          ? item.EventTicketType?.price || 0
          : item.Addon?.price || 0;

      const quantity = item.no_tickets || 1;

      if (item.ticket_type === "ticket") {
        totalTicketPrice += price * quantity;
      } else {
        totalAddonPrice += price * quantity;
      }
    });

    const discountedTicketTotal = round2(
      Math.max(totalTicketPrice - discountAmount, 0)
    );
    const discountedAddonTotal = round2(totalAddonPrice);
    const discountedTicketAndAddon = discountedTicketTotal + discountedAddonTotal;

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

    const totalTax = roundWithThreshold(ticketTax + addonTax + accommodationTax);

    // 6. Final Amounts
    const fullFinalAmount = roundWithThreshold(Math.round(discountedTicketAndAddon +
      totalAccommodationPrice + totalTax));

    const isPartial = selectedPaymentOption == "partial";
    const partialAccommodationAmount = roundWithThreshold(Math.round(totalAccommodationPrice / 2));
    const partialAccommodationTax = roundWithThreshold(Math.round(accommodationTax / 2));
    const partialFinalAmount = roundWithThreshold(Math.round(discountedTicketAndAddon + ticketTax + addonTax + partialAccommodationAmount + partialAccommodationTax));

    // === Total Tax Components ===
    // const totalBankFee = round2(ticketBankFee + addonBankFee + accommodationBankFee);
    // const totalPlatformFee = round2(ticketPlatformFee + addonPlatformFee);
    // const totalProcessingFee = round2(ticketProcessingFee + addonProcessingFee + accommodationProcessingFee);
    // const totalStripeFee = round2(ticketStripeFee + addonStripeFee + accommodationStripeFee);
    const totalBankFee = round2(ticketBankFee + addonBankFee);
    const totalPlatformFee = round2(ticketPlatformFee + addonPlatformFee);
    const totalProcessingFee = round2(ticketProcessingFee + addonProcessingFee );
    const totalStripeFee = round2(ticketStripeFee + addonStripeFee);

    const payableAmount = roundWithThreshold(isPartial ? partialFinalAmount : fullFinalAmount);
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
        discountAmount,
        ticket: discountedTicketTotal,
        addon: discountedAddonTotal,
        totalAccommodationPrice,
        totalBankFee,
        totalPlatformFee,
        totalProcessingFee,
        totalStripeFee,
        finalAmount: fullFinalAmount,
        totalTax: totalTax,
        partialAmount: isPartial ? partialFinalAmount : 0,
        payableAmount,
        accommodationTotal:totalAccommodationPrice,
        partialPayableAmount:partialFinalAmount,
        partialAccommodationAmount,
        partialAccommodationTax
      }
    };
  };

  const { breakdown } = calculateTotalsV2(
    cart,
    couponDetails?.discountAmt,
    propertyDetails,
    nights,
    selectedPaymentOption,
    ticketingFeeDetails
  );

  const { totalTax,discountAmount, payableAmount,finalAmount, totalAccommodationPrice,partialPayableAmount ,accommodationTotal} = breakdown;

  // console.log('>>>>>>>>>>>>>>>>>index', breakdown);

  const [showNextStep, setShowNextStep] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const isAvailable = await checkAccommodationAvailability(propertyId, eventId);
    if (!isAvailable) {
      setIsLoading(false);  // Reset loading state if not available
      return;               // Stop the process
    }

    setTimeout(() => {
      setShowNextStep(true);
      setIsLoading(false);
    }, 1000);
  };


  const handleFreeTicket = async () => {
    try {
      const data = {
        cart,
        couponDetails,
        adminFees,
      };
      // Encrypt the data
      const storedToken = localStorage.getItem("accessToken");
      const secretKey = process.env.DATA_ENCODE_SECRET_KEY;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        secretKey
      ).toString();

      Swal.fire({
        title: "Processing...",
        text: "Please wait while we create your ticket.",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `/api/v1/create-order`,
        { key: "free_ticket", data: encryptedData },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // If the API response is successful
      if (response.data.success) {
        setShow(false);
        Swal.fire({
          title: "Success!",
          text: "Your free ticket has been created successfully!",
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Okay",
          cancelButtonText: "Go to My Ticket",
          reverseButtons: true,
          customClass: {
            popup: "add-tckt-dtlpop",
          }
        }).then((result) => {
          if (result.isConfirmed) {
          } else if (result.dismiss == Swal.DismissReason.cancel) {
            navigate.push("/user/my-ticket");
          }
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.data.message || "Failed to create free ticket!",
          icon: "error",
          confirmButtonText: "Try Again",
          customClass: {
            popup: "add-tckt-dtlpop",
          },
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message || "An unexpected error occurred!",
        icon: "error",
        confirmButtonText: "Try Again",
        customClass: {
          popup: "add-tckt-dtlpop",
        }
      });
    }
  };

  useEffect(() => {
    if (eventDetails.StartDate && eventDetails.EventTimeZone) {
      const eventStart = moment.tz(
        eventDetails.StartDate,
        eventDetails.EventTimeZone
      );
      const currentDate = moment().tz(eventDetails.EventTimeZone);

      const daysToEvent = eventStart.diff(currentDate, "days");
      // const finalAmount = finalPriceAfterDiscount + taxes;
      // console.log(`Current DateTime In ${eventDetails.EventTimeZone} : ${currentDate.format('YYYY-MM-DD hh:mm A')}`);
      // console.log(`Total left ${daysToEvent} Days`);

      // Calculate the date before 'partial_payment_duration_days_count' days from event start
      const partialPaymentLastDate = eventStart
        .clone()
        .subtract(partial_payment_duration_days_count, "days");
      set_partial_payment_duration_last_date(partialPaymentLastDate);
      // console.log(`Partial Payment Valid Until: ${partialPaymentLastDate.format('MMMM Do, YYYY')}`);
      // console.log('>>>>>>>>', accommodationTotal);

      const eligibleForPartial =
        daysToEvent >= partial_payment_duration_days_count &&
        accommodationTotal >= partialPaymentEligibleBaseAmount;
      setIsPartialPaymentEligible(eligibleForPartial);
      setSelectedPaymentOption("full");
    }
  }, [eventDetails, accommodationTotal]);

  return (
    <>
      <Modal
        show={show && !cartModalShow}
        aria-labelledby="example-modal-sizes-title-sm"
        className="Crys-Accomo-Flw careyes-chekout-new oxmonten2025EvntSec"
        onHide={handleModalClose}
      >
        {!showNextStep ? (
          <>
            <Modal.Header>
              <Button
                onClick={handleModalClose}
                className="btn-close ms-auto"
                variant=""
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Modal.Header>

            {eventDetails && eventDetails.Name ? (
              <Modal.Body className="px-3 care-new-check">
                <LoadingComponent isActive={isLoading} />

                <form onSubmit={handleSubmit}>
                  <div className="checkout-innr">
                    <Row className="gy-4">
                      <Col lg={8} className="men-innr-sec">
                        <div className="checkot-lft">
                          <h2 className="ck-mn-hd">
                            ONDALINDA <span>x</span> CAREYES 2025
                          </h2>

                          {/* <span className="check-25-lft-pra">
                            Ondalinda x Careyes is a three-day elevated immersive cultural celebration with a cross-over of musical genres, incredible talents, art installations and soulful wellness experiences.  This year’s theme is CELESTIAL OBSESSION, an ode to the Zapotec culture or “Cloud People” of Monte Alban.
                          </span> */}

                          <span
                            className="check-25-lft-pra"
                            dangerouslySetInnerHTML={{
                              __html: eventDetails.Summary,
                            }}
                          />

                          <div className="ck-event-dtl">
                            <h3>MAIN EVENT I NOVEMBER 6-9, 2025</h3>
                            <p className="mnt-pr">
                              Your main event ticket includes access to
                              Thursday, Friday, and Saturday celebrations. It
                              includes food and beverages at all Ondalinda
                              official night events. Please note that tickets
                              are non-refundable but can be transferred to
                              another Ondalinda member. Locations and themes are
                              subject to change. Final program will be announced
                              closer to event date.
                            </p>

                            <div className="eventsBxSec">
                              {/* <h5>Events</h5> */}
                              <Row className=" gy-3">
                                <Col md={4}>
                                  <div className="evt-innr-dtl">
                                    <div className="monte-evntimgs">
                                      {/* <img
                                        src={`https://d2qmt8vqr148m6.cloudfront.net/assets/img/front-images/careyes-event6-nov.jpg`}
                                        className="firstDayEvent"
                                      /> */}
                                      <Image
                                        src="https://d2qmt8vqr148m6.cloudfront.net/assets/img/front-images/careyes-event6-nov.jpg"
                                        alt="Careyes Event"
                                        className="firstDayEvent"
                                        width={20} // or actual width
                                        height={20} // or actual height
                                        priority // Optional: load image eagerly
                                        unoptimized // Optional: use if image is from external URL and not in next.config.js domains
                                      />
                                    </div>
                                    <div className="monte-evntcnts">
                                      <hgroup>
                                        <h6>THU, NOV 6, 2025</h6>
                                        <p>Los Danzantes</p>
                                      </hgroup>
                                      <p>
                                        <span>Time:</span> 9PM to 4AM
                                      </p>
                                      <p>
                                        <span>Location:</span> Zyanya
                                      </p>
                                    </div>
                                  </div>
                                </Col>

                                <Col md={4}>
                                  <div className="evt-innr-dtl">
                                    <div className="monte-evntimgs">
                                      <Image
                                        src="https://d2qmt8vqr148m6.cloudfront.net/assets/img/front-images/careyes-event7-nov.jpg"
                                        alt="Careyes Event"
                                        className="firstDayEvent"
                                        width={20} // or actual width
                                        height={20} // or actual height
                                        priority // Optional: load image eagerly
                                        unoptimized // Optional: use if image is from external URL and not in next.config.js domains
                                      />
                                    </div>
                                    <div className="monte-evntcnts">
                                      <hgroup>
                                        <h6>FRI, NOV 7, 2025</h6>
                                        <p>The Cloud People</p>
                                      </hgroup>
                                      <p>
                                        <span>Time:</span> 10PM to 6AM
                                      </p>
                                      <p>
                                        <span>Location:</span> Polo Fields
                                      </p>
                                    </div>
                                  </div>
                                </Col>

                                <Col md={4}>
                                  <div className="evt-innr-dtl">
                                    <div className="monte-evntimgs">
                                      <Image
                                        src={`https://d2qmt8vqr148m6.cloudfront.net/assets/img/front-images/careyes-event8-nov.jpg`}
                                        alt="Careyes Event"
                                        className="firstDayEvent"
                                        width={20} // or actual width
                                        height={20} // or actual height
                                        priority // Optional: load image eagerly
                                        unoptimized // Optional: use if image is from external URL and not in next.config.js domains
                                      />
                                    </div>

                                    <div className="monte-evntcnts">
                                      <hgroup>
                                        <h6>SAT, NOV 8, 2025</h6>
                                        <p>The Zapotec Deities</p>
                                      </hgroup>
                                      <p>
                                        <span>Time:</span> 11PM to 7AM
                                      </p>
                                      <p>
                                        <span>Location:</span> Cabeza del Indio
                                      </p>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                            </div>

                            <Row className="align-items-center gy-3 marginTpMinus4">
                              {eventDetails?.EventTicketTypes?.filter(
                                (ticketType) =>
                                  ticketType.type == "open_sales" &&
                                  ticketType.hidden == "N" &&
                                  isSaleActive(
                                    ticketType.sale_start_date,
                                    ticketType.sale_end_date
                                  )
                              ).map((ticketType, index) => {
                                const cartItem = cart.find(
                                  (item) =>
                                    item.ticket_id == ticketType.id &&
                                    item.ticket_type == "ticket"
                                );

                                const ticketCount = cartItem?.no_tickets || 0;
                                const totalPrice =
                                  ticketCount * ticketType.price;
                                // const currencySymbol = eventDetails?.Currency?.Currency_symbol || '';

                                return (
                                  <Row
                                    key={`ticket-${ticketType.id}-${index}`}
                                    className="w-100 m-0"
                                  >
                                    <Col sm={4} className="mt-0">
                                      <div className="evnt-dtl-lft">
                                        {/* <h5 className="ticketTitleHd">{ticketType.title}</h5> */}
                                      </div>
                                    </Col>

                                    <Col sm={5} xs={6} className="mt-0 PrcRes1">
                                      <p className="amountCrt text-end">
                                        {ticketType.title} {currencySymbol}
                                        {formatSmartPrice(ticketType.price)} /
                                        pers.
                                        <span className="me-2">
                                          <br />
                                          <i>
                                            {" "}
                                            Total ({ticketCount}x):{" "}
                                            {currencySymbol}
                                            {formatSmartPrice(totalPrice)}
                                          </i>
                                        </span>
                                      </p>
                                    </Col>

                                    <Col sm={3} xs={6} className="mt-0">
                                      <div className="evnt-dtl-rgt monte-ticy-butn">
                                        <Button
                                          variant=""
                                          onClick={() =>
                                            handleDecrement(ticketType.id, "ticket")
                                          }
                                          disabled={
                                            isLoading || ticketCount <= minLimit
                                          }
                                        >
                                          -
                                        </Button>

                                        {/* <Button
                                          variant=""
                                          onClick={() =>
                                            handleDecrement(
                                              ticketType.id,
                                              "ticket"
                                            )
                                          }
                                          disabled={
                                            isLoading ||
                                            ticketCount <= minOccupancy
                                          }
                                        >
                                          -
                                        </Button> */}

                                        <span>{ticketCount}</span>

                                        <Button
                                          variant=""
                                          onClick={() =>
                                            handleIncrement(
                                              ticketType.id,
                                              "ticket"
                                            )
                                          }
                                          disabled={
                                            isLoading ||
                                            ticketCount >= maxOccupancy
                                          }
                                        >
                                          +
                                        </Button>
                                      </div>
                                    </Col>
                                  </Row>
                                );
                              })}
                            </Row>
                          </div>

                          <div className="ck-event-dtl ck-adon-event">
                            <h3>TRANSPORTATION PASS</h3>
                            <p className="mnt-pr">
                              You have the option to purchase a transportation
                              pass, granting access to Ondalinda's exclusive
                              transportation service within pre-specified
                              transfer windows. This pass comes in the form of a
                              bracelet, which is required to board the
                              transportation. Alternatively, you may arrange
                              your own transportation through one of our
                              preferred partners. For full details and pricing,
                              please visit the transportation page.
                            </p>
                            <Row className=" mt-3 gy-3">
                              {eventDetails &&
                                eventDetails.Addons &&
                                eventDetails.Addons.filter(
                                  (addonType) =>
                                    addonType.hidden == "N" &&
                                    addonType.addon_type == "Normal" &&
                                    isSaleActive(
                                      addonType.sale_start_date,
                                      addonType.sale_end_date
                                    )
                                ).map((addonType, index) => {
                                  const addonDetails = addonsDetailsArray.find(
                                    (addon) => addon.addonId == addonType.id
                                  );

                                  const totalAvailability =
                                    addonDetails?.total_addon || 0;
                                  const bookedCount = addonDetails?.count || 0;
                                  const availableCount =
                                    totalAvailability - bookedCount;

                                  const addonCartItem = cart.find(
                                    (item) =>
                                      item.addons_id == addonType.id &&
                                      item.ticket_type == "addon"
                                  );

                                  const addonInCart =
                                    addonCartItem?.no_tickets || 0;
                                  const totalAddonPrice =
                                    addonInCart * addonType.price;

                                  return (
                                    <>
                                      <Col
                                        lg={8}
                                        md={7}
                                        key={index + Math.random(100)}
                                      >
                                        <div className="adon-inr mon25-add-inr">
                                          <div className="montenAddOnImgDv">
                                            {/* <img
                                              src={
                                                addonType.addon_image
                                                  ? // ? `/assets/img/front-images/${addonType.addon_image}`
                                                  `/uploads/profiles/${addonType.addon_image}`
                                                  : `/imagenot/no-image-icon-1.png`
                                              }
                                              className="MontenAddOnImg"
                                            /> */}

                                            <Image
                                              src={
                                                addonType?.addon_image
                                                  ? `${process.env.NEXT_PUBLIC_S3_URL}/profiles/${addonType.addon_image}`
                                                  : `${process.env.NEXT_PUBLIC_S3_URL}/no-image-icon-1.png`
                                              }
                                              alt="Profile image"
                                              width={50}
                                              height={50}
                                              className="MontenAddOnImg"
                                            />


                                          </div>

                                          <div className="mnto-add-cnt">
                                            <hgroup>
                                              <h6>{addonType.addon_day}</h6>
                                              <p>
                                                {/* <span>Add-On Part :</span>{" "} */}
                                                {/* <span>“{addonType.name}”</span>{" "}
                                                – Dinner and sunset party on a
                                                Karaka ship. */}
                                                {/* {addonType.name} */}
                                              </p>
                                            </hgroup>

                                            {/* <Col md={7}> */}
                                            <div className="adon-desc">
                                              {/* <p>{addonType.description}</p> */}
                                              {addonType.description && (
                                                <p
                                                  dangerouslySetInnerHTML={{
                                                    __html:
                                                      addonType.description,
                                                  }}
                                                ></p>
                                              )}
                                            </div>
                                            {/* </Col> */}

                                            <div className="adon-time">
                                              {addonType.addon_time && (
                                                <p>
                                                  <span>Time: </span>
                                                  {addonType.addon_time}{" "}
                                                </p>
                                              )}

                                              {addonType.addon_location && (
                                                <p>
                                                  <span>
                                                    Transfer Locations:{" "}
                                                  </span>
                                                  {addonType.addon_location}{" "}
                                                </p>
                                              )}

                                              {/* {addonType.addon_dress_code && (
                                                <p>
                                                  <span> Dress Code:</span>{" "}
                                                  {addonType.addon_dress_code}
                                                </p>
                                              )} */}
                                            </div>
                                          </div>
                                        </div>
                                      </Col>

                                      <Col
                                        lg={4}
                                        md={5}
                                        className="d-flex justify-content-between align-items-end"
                                      >
                                        <div className="adon-inr-rgt monten-ason-inr-rgt">
                                          <p className="montenPriceDv">
                                            {currencySymbol}
                                            {formatSmartPrice(
                                              addonType.price
                                            )}{" "}
                                            / pers.
                                            <span className="me-2">
                                              <br />
                                              <i>
                                                Total ({addonInCart}x):{" "}
                                                {currencySymbol}
                                                {formatSmartPrice(
                                                  totalAddonPrice
                                                )}
                                              </i>
                                            </span>
                                          </p>

                                          {availableCount > 0 ? (
                                            <div className="evnt-dtl-rgt">
                                              <Button
                                                variant=""
                                                onClick={() =>
                                                  handleDecrement(
                                                    addonType.id,
                                                    "addon"
                                                  )
                                                }
                                                disabled={addonInCart === 0}
                                              >
                                                -
                                              </Button>

                                              <span>{addonInCart}</span>

                                              <Button
                                                variant=""
                                                onClick={() =>
                                                  handleIncrement(
                                                    addonType.id,
                                                    "addon"
                                                  )
                                                }
                                                disabled={
                                                  addonInCart >= availableCount
                                                }
                                              >
                                                +
                                              </Button>
                                            </div>
                                          ) : (
                                            <div className="evnt-dtl-rgt">
                                              <span className="">Sold Out</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* <h4 className="adn-avlity">
                                          <span>Availability</span>{" "}
                                          {availableCount != null
                                            ? availableCount
                                            : 0}{" "}
                                          /{" "}
                                          {totalAvailability != null
                                            ? totalAvailability
                                            : 0}
                                        </h4> */}
                                      </Col>
                                    </>
                                  );
                                })}
                            </Row>
                            {/* <p className="addOnDataCnt">The Balkan Peninsula was once ruled by the ancient Kingdom of Illyria, renowned for its shipbuilding, seafaring, and piracy. We invite guests to embark on replicas of 16th-century Balkan merchant galleon ships, the Karaka and Galijun, for a sunset boat tour featuring dinner, DJs, and dancing aboard.</p> */}
                          </div>

                          {/* new-add-accommodation */}
                          {propertyDetails && (
                            <div className="ck-event-dtl crys-accmo ck-adon-event">
                              <h3 className="text-uppercase">ACCOMMODATION</h3>
                              <p className="mnt-pr">
                                Here you can find the accommodation you’ve
                                reserved for Ondalinda x Careyes 2025. Whether
                                it’s a private villa tucked into the hills or a
                                colorful casa steps from the sea, this space
                                will be your personal sanctuary throughout the
                                festival. A place to rest, recharge, and share
                                meaningful moments with your community. All
                                details are listed below — welcome home.
                              </p>
                              <Row className=" mt-3 gy-3">
                                <>
                                  <Col md={10}>
                                    <div className="adon-inr special-addon-inr  mon25-add-inr">
                                      <div className="montenAddOnImgDv">

                                        <Image
                                          src={
                                            propertyDetails?.ImageURL
                                              ? `${process.env.NEXT_PUBLIC_S3_URL}/housing/${propertyDetails.ImageURL}`
                                              : `${process.env.NEXT_PUBLIC_S3_URL}/housing/housingdumy.png`
                                          }
                                          alt="Property Image"
                                          width={50}
                                          height={50}
                                          className="Property Img"
                                        />
                                      </div>

                                      <div className="mnto-add-cnt">
                                        <hgroup>
                                          <h6>{propertyDetails?.Name}</h6>
                                        </hgroup>
                                        <div className="adon-desc">
                                          <p>
                                            Enjoy your stay at{" "}
                                            {
                                              propertyDetails
                                                ?.HousingNeighborhood.name
                                            }
                                            , {propertyDetails?.location}!
                                          </p>
                                        </div>
                                        <div className="adon-time">
                                          {bookingParams && (
                                            <>
                                              <p>
                                                <span>Dates: </span>
                                                {dateRange}
                                              </p>
                                              <p>
                                                <span>Number of nights: </span>
                                                {nights}
                                              </p>
                                              {/* <p>
                                                <span>Minimum guests: </span>{propertyDetails.NumBedrooms}
                                              </p>
                                              <p>
                                                <span>Maximum guests: </span>{propertyDetails.MaxOccupancy}
                                              </p> */}
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Col>

                                  <Col md={2} className="crd-ad-acco">
                                    <div className="specil-adon-btn">
                                      <div className="adon-inr-rgt monten-ason-inr-rgt">
                                        <p className="montenPriceDv me-0">
                                          {currencySymbol}
                                          {propertyDetails?.EventHousings?.[0]
                                            ?.totalAfterTaxes
                                            ? `${formatSmartPrice(
                                              propertyDetails.EventHousings[0]
                                                .totalAfterTaxes
                                            )}`
                                            : ""}{" "}
                                          / night
                                        </p>
                                        {/* <p className="montenPriceDv me-0">
                                          <i>(taxes included)</i>
                                        </p> */}
                                      </div>
                                    </div>
                                  </Col>
                                </>
                                {/* );
                                })} */}
                              </Row>
                            </div>
                          )}
                        </div>
                      </Col>

                      {/* Checkout Calculation Start */}

                      <Col
                        lg={4}
                        className="crys-accomo-rgt men-innr-sec monten25-rgt-pnl"
                      >
                        <div className="checkot-rgt">
                          <div
                            className="checkot-rgt-bnr mont25rgt-bnt "
                            style={{
                              backgroundImage: `url(${eventDetails?.ImageURL
                                ? `${process.env.NEXT_PUBLIC_S3_URL}/profiles/${eventDetails.ImageURL}`
                                : `${process.env.NEXT_PUBLIC_S3_URL}/no-image-icon-1.png`
                                })`,
                            }}
                          >
                            <img
                              src={`/assets/img/brand/white-logo.svg`}
                              alt="Logo"
                            />
                          </div>
                          {cart.length > 0 ? (
                            <div className="checkot-tct-purcs monte25-tct-purcs">
                              <h6>YOUR TICKETS</h6>

                              {cart.map((item, index) => {
                                const {
                                  ticket_type,
                                  no_tickets,
                                  EventTicketType,
                                  Addon,
                                } = item;
                                const isTicket = ticket_type == "ticket";
                                const isAddon = ticket_type == "addon";
                                const title =
                                  isTicket && EventTicketType
                                    ? EventTicketType.title
                                    : isAddon && Addon
                                      ? Addon.name
                                      : "Unknown";

                                const price =
                                  isTicket && EventTicketType
                                    ? EventTicketType.price * no_tickets
                                    : isAddon && Addon
                                      ? Addon.price * no_tickets
                                      : 0;

                                return (
                                  <div
                                    key={`${ticket_type}-${index}`}
                                    className="yr-tct-dtl"
                                  >
                                    <p className="yr-tct-dtl-para">
                                      {no_tickets}x <span>{title}</span>
                                    </p>
                                    <p
                                      style={{ cursor: "pointer" }}
                                      title="Ticket"
                                    >
                                      {currencySymbol || ""}
                                      {formatSmartPrice(price)}
                                    </p>
                                  </div>
                                );
                              })}

                              {propertyDetails &&
                                (() => {
                                  // const ownerAmount = propertyDetails?.EventHousings?.[0]?.OwnerAmount || 0;
                                  // const roundedAccomoTotalAmount = Math.round(ownerAmount * nights);

                                  return (
                                    <div
                                      key={propertyDetails.Name}
                                      className="yr-tct-dtl"
                                    >
                                      <p className="yr-tct-dtl-para">
                                        {nights}x{" "}
                                        <span>
                                          {propertyDetails.Name || "Unknown"}
                                        </span>
                                      </p>
                                      <p
                                        style={{ cursor: "pointer" }}
                                        title="Accommodation"
                                      >
                                        {currencySymbol || ""}
                                        {formatSmartPrice(totalAccommodationPrice)}
                                        {/* <img
                                        src="/assets/img/front-images/caryes-ticket-dlt.png"
                                        alt="delete-icon"
                                        onClick={() => handleDeleteCartItem("accommodation")}
                                      /> */}
                                      </p>
                                    </div>
                                  );
                                })()}

                              {errorMessage && (
                                <p
                                  className="error-message"
                                  style={{
                                    color: "red",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {errorMessage}
                                </p>
                              )}

                              {successMessage && (
                                <p
                                  className="success-message"
                                  style={{
                                    color: "#ff6d94",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {successMessage}
                                </p>
                              )}

                              <h6 className="mt-5 rgt-ttl-txt">
                                TOTAL{" "}
                                <p>
                                  {cart.reduce(
                                    (total, item) => total + item.no_tickets,
                                    0
                                  )}{" "}
                                  ticket
                                  {cart.reduce(
                                    (total, item) => total + item.no_tickets,
                                    0
                                  ) > 1
                                    ? "s"
                                    : ""}
                                </p>
                                {propertyDetails && <p>1 accommodation</p>}
                              </h6>

                              {/* coupon code  */}
                              <div className="apply-cd">
                                {couponError && (
                                  <p
                                    style={{
                                      color: "red",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {couponError}
                                  </p>
                                )}
                                {couponSuccessMessage && (
                                  <p
                                    style={{
                                      color: "#ff6d94",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {couponSuccessMessage}
                                  </p>
                                )}

                                <InputGroup className="input-group">
                                  <Form.Control
                                    className="form-control"
                                    placeholder="ENTER STAFF ID"
                                    type="text"
                                    value={coupon}
                                    onChange={(e) =>
                                      setCoupon(e.target.value.toUpperCase())
                                    }
                                  />

                                  {couponDetails ? (
                                    <Button
                                      variant=""
                                      className="btn"
                                      type="button"
                                      onClick={handleRemoveCoupon}
                                    >
                                      REMOVE
                                    </Button>
                                  ) : (
                                    <Button
                                      variant=""
                                      className="btn"
                                      type="button"
                                      onClick={handleApplyCoupon}
                                    >
                                      APPLY
                                    </Button>
                                  )}
                                </InputGroup>
                              </div>

                              {/* Calculate accomo price once */}
                              {(() => {
                                // const accomoPrice =
                                //   propertyDetails?.EventHousings?.[0]?.OwnerAmount
                                //     ? Math.round(propertyDetails.EventHousings[0].OwnerAmount * nights)
                                //     : 0;

                                return (
                                  <div className="tickt-ttl-prs">
                                    {/* <div className="tct-ttl-innr">
                                      <p>PRICE</p>
                                      <span>
                                        {currencySymbol || ""}
                                        {formatSmartPrice(totalBeforeDiscount)}
                                      </span>
                                    </div> */}

                                    {couponDetails && (
                                      <div className="tct-ttl-innr">
                                        <p>STAFF ID</p>
                                        <span>
                                          {couponDetails.discount_type ===
                                            "percentage" ? (
                                            <>
                                              -{" "}
                                              {Math.floor(
                                                couponDetails.discount_value
                                              )}
                                              % ({currencySymbol}
                                              {formatSmartPrice(discountAmount)}
                                              )
                                            </>
                                          ) : (
                                            <>
                                              - {currencySymbol || ""}
                                              {formatSmartPrice(discountAmount)}
                                            </>
                                          )}
                                        </span>
                                      </div>
                                    )}

                                    {totalTax > 0 && (
                                      <div className="tct-ttl-innr">
                                        <p>
                                          FEES & TAXES
                                        </p>
                                        <span>
                                          {currencySymbol || ""}
                                          {formatSmartPrice(totalTax)}
                                        </span>
                                      </div>
                                    )}

                                    {/* <div className="tct-ttl-innr">
                                      <p>ACCOMMODATION TAXES ({accommodationTaxes}%)</p>
                                      <span>
                                        {currencySymbol || ""}
                                        {formatSmartPrice(accommodationTax)}
                                      </span>
                                    </div> */}

                                    <div className="tct-ttl-innr">
                                      <p>TOTAL</p>
                                      <p>
                                        {currencySymbol || ""}
                                        {formatSmartPrice(finalAmount)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}

                              {eventDetails.isSaleStart === "N" ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "#f8d7da",
                                    padding: "20px",
                                    borderRadius: "8px",
                                    boxShadow:
                                      "0px 0px 15px rgba(0, 0, 0, 0.1)",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      display: "flex",
                                      alignItems: "center",
                                      fontSize: "16px",
                                      color: "#721c24",
                                      fontWeight: "bold",
                                      animation: "blink 1.5s infinite",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: "24px",
                                        color: "#dc3545",
                                        marginRight: "10px",
                                      }}
                                    >
                                      <i className="fa fa-lock" />
                                    </span>
                                    <span>
                                      The ticket sale is temporarily closed.
                                      We're working to start it shortly. Please
                                      check back soon!
                                    </span>
                                  </p>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          ) : (
                            <div className="cart-wrapper">
                              <h3 className="cart-emty">Cart is Empty</h3>
                              {errorMessage && (
                                <p
                                  className="error-message"
                                  style={{
                                    color: "red",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {errorMessage}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* validation impelement if there is no tickets then do not show the cart */}

                        {cart
                          ?.filter((item) => item.ticket_type == "ticket")
                          .reduce(
                            (sum, item) => sum + (item.no_tickets || 0),
                            0
                          ) > 0 && (
                            <>
                              {isPartialPaymentEligible && (
                                <div className="checkot-rgt accom-flw-nw-added">
                                  <p>
                                    Your total exceeds {currencySymbol || ""}
                                    {formatSmartPrice(
                                      partialPaymentEligibleBaseAmount
                                    )}{" "}
                                    {eventDetails?.Currency?.Currency || ""}. You
                                    have the option to pay half of the
                                    ACCOMMODATION rental amount now and the other
                                    half by{" "}
                                    {partial_payment_duration_last_date
                                      ? partial_payment_duration_last_date.format(
                                        "MMMM Do, YYYY"
                                      )
                                      : ""}
                                    . Your accommodation is not finalized until
                                    the total amount has been received.
                                  </p>

                                  <h6>PAYMENT METHODS</h6>
                                  <ul>
                                    {/* Always show FULL PAYMENT option */}
                                    <li key={Math.random(10000)}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="paymentOption"
                                          id="payFull"
                                          value="full"
                                          required
                                          checked={
                                            selectedPaymentOption === "full"
                                          }
                                          onChange={handlePaymentOptionChange}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="payFull"
                                        >
                                          <p>
                                            I would like to pay the full amount
                                            for my accommodation and tickets now (
                                            {currencySymbol || ""}
                                            {formatSmartPrice(
                                              finalAmount
                                            )}{" "}
                                            {eventDetails?.Currency?.Currency ||
                                              ""}
                                            ).
                                          </p>
                                        </label>
                                      </div>
                                    </li>

                                    {/* Conditionally show PARTIAL PAYMENT */}
                                    {/* {isPartialPaymentEligible && ( */}
                                    <li key={Math.random(10000)}>
                                      <div className="form-check">
                                        <input
                                          className="form-check-input"
                                          type="radio"
                                          name="paymentOption"
                                          id="partial"
                                          value="partial"
                                          checked={
                                            selectedPaymentOption === "partial"
                                          }
                                          onChange={handlePaymentOptionChange}
                                        />
                                        <label
                                          className="form-check-label"
                                          htmlFor="partial"
                                        >
                                          <p>
                                            I would like to pay half now (
                                            {currencySymbol || ""}
                                            {formatSmartPrice(
                                              partialPayableAmount
                                            )}{" "}
                                            {eventDetails?.Currency?.Currency ||
                                              ""}
                                            ) and pay the remaining balance later.
                                          </p>
                                        </label>
                                      </div>
                                    </li>
                                    {/* )} */}
                                  </ul>
                                </div>
                              )}

                              {/* Buy button  */}
                              <div className="by-nw-btn accomofl-ck-bt">
                                <Button
                                  variant=""
                                  className="btn"
                                  type="submit"
                                  onClick={(e) => {
                                    if (payableAmount == 0) {
                                      e.preventDefault();
                                      handleFreeTicket();
                                    }
                                  }}
                                >
                                  {payableAmount == 0
                                    ? "FREE TICKET"
                                    : "PURCHASE"}
                                </Button>
                              </div>
                            </>
                          )}
                      </Col>

                      {/* Checkout Calculation End */}
                    </Row>
                  </div>
                </form>
              </Modal.Body>
            ) : (
              <LoadingComponent isActive={isLoading} />
            )}
          </>
        ) : (
          <CheckOutComponent
            userId={userId}
            eventId={eventId}
            handleModalClose={handleModalClose}
            showNextStep={setShowNextStep}
            totalAmountToBePay={payableAmount}
            couponDetails={couponDetails}
            paymentBreakdown={breakdown}
            cartData={cart}
            adminFees={adminFees}
            donationFees={donationFees}
            propertyDetails={propertyDetails}
            nights={nights}
            eventInfo={eventDetails}
            bookingDates={bookingDates}
            selectedPaymentOption={selectedPaymentOption}
            taxesInfo={ticketingFeeDetails}
            accommodationTaxes={accommodationTaxes}
            eventHousingId={eventHousingId}
          />
        )}
      </Modal>
    </>
  );
}
