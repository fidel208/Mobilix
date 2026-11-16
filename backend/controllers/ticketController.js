import prisma from "../lib/prisma.js";

const generateTicketNumber = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `MX-${randomNum}`;
};

export const searchTicket = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Please enter a ticket number or phone number to search.",
      });
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          { ticketNumber: { equals: query, mode: "insensitive" } },
          { phoneNumber: { contains: query } },
          { mpesaRefCode: { equals: query, mode: "insensitive" } },
        ],
      },
    });

    if (!ticket) {
      return res.status(404).json({
        status: "error",
        message: "No ticket found matching that number or phone.",
      });
    }

    return res.status(200).json({
      status: "success",
      ticket,
    });
  } catch (error) {
    console.error("Search ticket error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error during ticket lookup.",
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

// POST /api/tickets (Admin manual ticket creation)
export const createTicket = async (req, res) => {
  try {
    const { firstName, lastName, phone, amount, refCode, route, travelDate, seats } = req.body;
    if (!firstName || !lastName || !phone || amount === undefined) {
      return res.status(400).json({
        status: "error",
        message: "First name, last name, phone number, and amount are required.",
      });
    }

    // Create a corresponding booking record first
    const booking = await prisma.booking.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        startingPoint: route ? route.split(" to ")[0] || "N/A" : "Local",
        destination: route ? route.split(" to ")[1] || "N/A" : "Local",
        serviceType: "local-transit",
        travelDate: travelDate || new Date().toISOString().split("T")[0],
        seats: seats ? parseInt(seats) : 1,
        paymentType: "now",
        mpesaNumber: phone.trim(),
        status: "PAID",
      },
    });

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: generateTicketNumber(),
        bookingId: booking.id,
        passengerName: `${firstName.trim()} ${lastName.trim()}`,
        phoneNumber: phone.trim(),
        mpesaRefCode: refCode ? refCode.trim() : `REF-${Date.now().toString(36).toUpperCase()}`,
        route: route || "Local transit",
        travelDate: travelDate || new Date().toISOString().split("T")[0],
        seats: seats ? parseInt(seats) : 1,
        amount: parseFloat(amount),
        status: "CONFIRMED",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Ticket created successfully!",
      ticket,
    });
  } catch (error) {
    console.error("Create ticket error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create ticket." });
  }
};

// DELETE /api/tickets/:id
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ticket.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Ticket deleted successfully." });
  } catch (error) {
    console.error("Delete ticket error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete ticket." });
  }
};
