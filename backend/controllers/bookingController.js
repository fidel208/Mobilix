import prisma from "../lib/prisma.js";
import { sendTicketEmail } from "../services/emailService.js";
import { initiateStkPush, formatMpesaPhoneNumber } from "../services/mpesaService.js";

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
      email,
      startingPoint,
      destination,
      travelDate,
      seats,
      vehicleId,
      routeId,
      paymentType,
      mpesaNumber,
    } = req.body;

    const normalizedServiceType = String(serviceType || "").trim();
    const normalizedFirstName = String(firstName || "").trim();
    const normalizedLastName = String(lastName || "").trim();
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
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
    if (!normalizedEmail) {
      return res
        .status(400)
        .json({ status: "error", message: "Email address is required." });
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
    if (!vehicleId) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "A valid vehicle added by the admin must be selected.",
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

    
    const adminVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!adminVehicle) {
      return res.status(400).json({
        status: "error",
        message:
          "Selected vehicle does not exist or has been removed by the admin.",
      });
    }

    
    let adminRoute = null;
    if (routeId) {
      adminRoute = await prisma.route.findUnique({
        where: { id: routeId },
      });
    }

    if (!adminRoute && normalizedStartingPoint && normalizedDestination) {
      adminRoute = await prisma.route.findFirst({
        where: {
          startingPoint: { equals: normalizedStartingPoint, mode: "insensitive" },
          destination: { equals: normalizedDestination, mode: "insensitive" },
        },
      });
    }

    
    if (!adminRoute && normalizedServiceType !== "hire") {
      return res.status(400).json({
        status: "error",
        message:
          "Selected route does not exist or has not been added by an administrator. Please select an available admin route.",
      });
    }

    const formattedCarLabel = `${adminVehicle.name} (${adminVehicle.plate})`;
    let routeFare = 0;
    if (normalizedServiceType === "hire") {
      const vName = (adminVehicle.name || "").toLowerCase();
      const isSevenSeater = vName.includes("sienta") || vName.includes("noah") || vName.includes("voxy") || vName.includes("7");
      const matchedRoute =
        adminRoute ||
        (await prisma.route.findFirst({
          where: {
            serviceType: "car-hire",
            ...(isSevenSeater
              ? {
                  OR: [
                    { destination: { contains: "7", mode: "insensitive" } },
                    { startingPoint: { contains: "7", mode: "insensitive" } },
                    { destination: { contains: "sienta", mode: "insensitive" } },
                    { price: { gte: 4000 } },
                  ],
                }
              : {
                  OR: [
                    { destination: { contains: "4", mode: "insensitive" } },
                    { startingPoint: { contains: "4", mode: "insensitive" } },
                    { price: { lte: 3500 } },
                  ],
                }),
          },
          orderBy: { price: "asc" },
        })) ||
        (await prisma.route.findFirst({
          where: { serviceType: "car-hire" },
          orderBy: { price: isSevenSeater ? "desc" : "asc" },
        }));

      if (matchedRoute) {
        routeFare = Number(matchedRoute.price);
        adminRoute = matchedRoute;
      } else {
        routeFare = isSevenSeater ? 4500 : 3000;
      }
    } else {
      routeFare = adminRoute ? Number(adminRoute.price) : 500;
    }
    const rentalDaysMultiplier =
      normalizedServiceType === "hire"
        ? String(req.body.days).toLowerCase() === "more"
          ? 2
          : 1
        : 1;
    const totalAmount =
      normalizedServiceType === "hire"
        ? routeFare * rentalDaysMultiplier
        : routeFare * seatCount;
    const ticketCode = generateTicketNumber();

    let stkResult = null;
    let mpesaRefCode = "PAYMENT ON ARRIVAL";
    let initialStatus = "CONFIRMED";
    let bookingInitialStatus = "CONFIRMED";

    if (normalizedPaymentType === "now") {
      if (!mpesaNumber) {
        return res.status(400).json({
          status: "error",
          message: "M-Pesa phone number is required for immediate payment.",
        });
      }

      const formattedPhone = formatMpesaPhoneNumber(mpesaNumber);
      if (!formattedPhone || formattedPhone.length !== 12) {
        return res.status(400).json({
          status: "error",
          message: "Please enter a valid Kenyan Safaricom phone number (e.g. 07XXXXXXXX or 01XXXXXXXX).",
        });
      }

      
      stkResult = await initiateStkPush({
        phoneNumber: formattedPhone,
        amount: totalAmount,
        accountReference: ticketCode,
        transactionDesc: "Ticket Booking",
      });

      if (!stkResult.success) {
        return res.status(400).json({
          status: "error",
          message: stkResult.message || "Failed to initiate M-Pesa STK push. Please check your phone number.",
        });
      }

      
      mpesaRefCode = stkResult.checkoutRequestId;
      initialStatus = "PENDING_PAYMENT";
      bookingInitialStatus = "PENDING_PAYMENT";
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: req.user?.id || null,
        email: normalizedEmail,
        checkoutRequestId: stkResult?.checkoutRequestId || null,
        serviceType: normalizedServiceType,
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        startingPoint: adminRoute ? adminRoute.startingPoint : normalizedStartingPoint,
        destination: adminRoute ? adminRoute.destination : normalizedDestination,
        travelDate: normalizedTravelDate,
        seats: seatCount,
        carType: formattedCarLabel,
        paymentType: normalizedPaymentType,
        mpesaNumber: mpesaNumber || null,
        status: bookingInitialStatus,
      },
    });

    const newTicket = await prisma.ticket.create({
      data: {
        ticketNumber: ticketCode,
        bookingId: newBooking.id,
        passengerName: `${normalizedFirstName} ${normalizedLastName}`,
        phoneNumber: mpesaNumber || "N/A",
        mpesaRefCode: mpesaRefCode,
        route: `${(adminRoute ? adminRoute.startingPoint : normalizedStartingPoint).toUpperCase()} to ${(adminRoute ? adminRoute.destination : normalizedDestination).toUpperCase()}`,
        travelDate: normalizedTravelDate,
        seats: newBooking.seats,
        amount: totalAmount,
        status: initialStatus,
      },
    });

    
    if (normalizedEmail && normalizedPaymentType !== "now") {
      sendTicketEmail(normalizedEmail, {
        booking: newBooking,
        ticket: newTicket,
        vehicle: adminVehicle,
        route: adminRoute,
      }).catch((err) =>
        console.error("Resend ticket email notification error:", err),
      );
    }

    
    if (normalizedEmail) {
      await prisma.communityMember
        .upsert({
          where: { email: normalizedEmail },
          update: { status: "subscribed" },
          create: {
            email: normalizedEmail,
            status: "subscribed",
          },
        })
        .catch((err) =>
          console.error("Auto community member upsert error:", err),
        );
    }

    return res.status(201).json({
      status: "success",
      message:
        normalizedPaymentType === "now"
          ? "M-Pesa STK prompt sent to your phone! Please enter your M-Pesa PIN to complete payment."
          : "Booking successful! Ticket generated.",
      requiresPayment: normalizedPaymentType === "now",
      checkoutRequestId: stkResult?.checkoutRequestId || null,
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
