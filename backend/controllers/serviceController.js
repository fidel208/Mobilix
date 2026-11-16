import prisma from "../lib/prisma.js";

// GET /api/services
export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Compute route counts and booking stats for each service
    const servicesWithStats = await Promise.all(
      services.map(async (service) => {
        const routeCount = await prisma.route.count({
          where: {
            serviceType: {
              equals: service.name.toLowerCase().replace(/\s+/g, "-"),
              mode: "insensitive",
            },
          },
        });

        const bookings = await prisma.booking.findMany({
          where: {
            serviceType: {
              equals: service.name.toLowerCase().replace(/\s+/g, "-"),
              mode: "insensitive",
            },
          },
          include: { ticket: true },
        });

        const ticketCount = bookings.filter((b) => b.ticket).length;
        const revenue = bookings.reduce(
          (sum, b) => sum + (b.ticket?.amount || 0),
          0
        );

        return {
          ...service,
          routesCount: routeCount,
          ticketsBooked: ticketCount,
          revenue,
        };
      })
    );

    return res.status(200).json({ status: "success", services: servicesWithStats });
  } catch (error) {
    console.error("Get services error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch services." });
  }
};

// POST /api/services
export const createService = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        status: "error",
        message: "Service name and description are required.",
      });
    }

    const existing = await prisma.service.findUnique({
      where: { name: name.trim() },
    });
    if (existing) {
      return res.status(400).json({
        status: "error",
        message: "A service with this name already exists.",
      });
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        description: description.trim(),
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Service created successfully!",
      service: {
        ...service,
        routesCount: 0,
        ticketsBooked: 0,
        revenue: 0,
      },
    });
  } catch (error) {
    console.error("Create service error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create service." });
  }
};

// DELETE /api/services/:id
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Service deleted successfully." });
  } catch (error) {
    console.error("Delete service error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete service." });
  }
};
