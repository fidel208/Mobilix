import prisma from "../lib/prisma.js";

export const getRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ status: "success", routes });
  } catch (error) {
    console.error("Get routes error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch routes." });
  }
};

export const createRoute = async (req, res) => {
  try {
    const { startingPoint, destination, price, serviceType } = req.body;
    if (!startingPoint || !destination || price === undefined || !serviceType) {
      return res.status(400).json({
        status: "error",
        message:
          "Starting point, destination, price, and service type are required.",
      });
    }

    const route = await prisma.route.create({
      data: {
        startingPoint: startingPoint.trim(),
        destination: destination.trim(),
        price: parseFloat(price),
        serviceType,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Route created successfully!",
      route,
    });
  } catch (error) {
    console.error("Create route error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create route." });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.route.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Route deleted successfully." });
  } catch (error) {
    console.error("Delete route error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete route." });
  }
};
