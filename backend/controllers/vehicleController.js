import prisma from "../lib/prisma.js";

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ status: "success", vehicles });
  } catch (error) {
    console.error("Get vehicles error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to fetch vehicles." });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { name, plate, serviceType } = req.body;
    if (!name || !plate || !serviceType) {
      return res.status(400).json({
        status: "error",
        message: "Vehicle name, number plate, and service type are required.",
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        name: name.trim(),
        plate: plate.trim().toUpperCase(),
        serviceType,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Vehicle added successfully!",
      vehicle,
    });
  } catch (error) {
    console.error("Create vehicle error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to create vehicle." });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({ where: { id } });
    return res
      .status(200)
      .json({ status: "success", message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete vehicle." });
  }
};
