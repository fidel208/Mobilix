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

    const newBooking = await prisma.booking.create({
      data: {
        serviceType,
        firstName,
        lastName,
        startingPoint,
        destination,
        travelDate,
        seats: seats ? parseInt(seats) : 1,
        carType: carType || null,
        paymentType,
        mpesaNumber: mpesaNumber || null,
        status: paymentType === "now" ? "PAID" : "CONFIRMED",
      },
    });

    const mpesaCode =
      paymentType === "now" ? generateMpesaRef() : "PAYMENT ON ARRIVAL";
    const ticketCode = generateTicketNumber();

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber: ticketCode,
        bookingId: newBooking.id,
        passengerName: `${firstName} ${lastName}`,
        phoneNumber: mpesaNumber || "N/A",
        mpesaRefCode: mpesaCode,
        route: `${startingPoint.toUpperCase()} to ${destination.toUpperCase()}`,
        travelDate,
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
