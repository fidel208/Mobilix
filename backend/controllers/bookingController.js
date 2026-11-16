import prisma from "../lib/prisma.js";

const generateTicketNumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MX-${randomNum}`;
};

const generateMpesaRef = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createBooking = async (req, res) => {
  try {
    const {
      serviceType,
      firstName,
      lastName,
      startingPoint,
      destination,
      travelDate,
      seats,
      carType,
      paymentType,
      mpesaNumber,
    } = req.body;

    const normalizedServiceType = String(serviceType || "").trim();
    const normalizedFirstName = String(firstName || "").trim();
    const normalizedLastName = String(lastName || "").trim();
    const normalizedStartingPoint = String(startingPoint || "").trim();
    const normalizedDestination = String(destination || "").trim();
    const normalizedTravelDate = String(travelDate || "").trim();
    const normalizedPaymentType = String(paymentType || "")
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, " ");
    const seatCount = Number.parseInt(seats, 10);

    if (!normalizedServiceType) {
      return res
        .status(400)
        .json({ status: "error", message: "Service type is required." });
    }
    if (!normalizedFirstName || !normalizedLastName) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "First name and last name are required.",
        });
    }
    if (!normalizedStartingPoint) {
      return res
        .status(400)
        .json({ status: "error", message: "Starting point is required." });
    }
    if (!normalizedDestination) {
      return res
        .status(400)
        .json({ status: "error", message: "Destination is required." });
    }
    if (!normalizedTravelDate) {
      return res
        .status(400)
        .json({ status: "error", message: "Travel date is required." });
    }
    if (
      !normalizedPaymentType ||
      !["now", "arrival", "payment on arrival"].includes(normalizedPaymentType)
    ) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Payment type must be 'now' or 'arrival'.",
        });
    }
    if (!Number.isInteger(seatCount) || seatCount < 1) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "Seats must be a whole number greater than 0.",
        });
    }

    const newBooking = await prisma.booking.create({
      data: {
        serviceType: normalizedServiceType,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        startingPoint: normalizedStartingPoint,
        destination: normalizedDestination,
        travelDate: normalizedTravelDate,
        seats: seatCount,
        carType: carType || null,
        paymentType: normalizedPaymentType,
        mpesaNumber: mpesaNumber || null,
        status: normalizedPaymentType === "now" ? "PAID" : "CONFIRMED",
      },
    });

    const mpesaCode =
      normalizedPaymentType === "now"
        ? generateMpesaRef()
        : "PAYMENT ON ARRIVAL";
    const ticketCode = generateTicketNumber();

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber: ticketCode,
        bookingId: newBooking.id,
        passengerName: `${normalizedFirstName} ${normalizedLastName}`,
        phoneNumber: mpesaNumber || "N/A",
        mpesaRefCode: mpesaCode,
        route: `${normalizedStartingPoint.toUpperCase()} to ${normalizedDestination.toUpperCase()}`,
        travelDate: normalizedTravelDate,
        seats: newBooking.seats,
        amount: newBooking.seats * 500,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Booking successful! Ticket generated.",
      booking: newBooking,
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Booking & Ticket error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error while generating ticket.",
    });
  }
};

export const getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ status: "success", tickets });
  } catch (error) {
    console.error("Fetch tickets error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch tickets." });
  }
};
