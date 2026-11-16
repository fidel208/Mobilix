import { Router } from "express";
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";

const vehiclesRouter = Router();

vehiclesRouter.get("/", getVehicles);
vehiclesRouter.post("/", createVehicle);
vehiclesRouter.delete("/:id", deleteVehicle);

export default vehiclesRouter;
