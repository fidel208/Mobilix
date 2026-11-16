import prisma from "../lib/prisma.js";

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
