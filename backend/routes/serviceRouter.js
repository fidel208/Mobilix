import { Router } from "express";
import {
  getServices,
  createService,
  deleteService,
} from "../controllers/serviceController.js";

const serviceRouter = Router();

serviceRouter.get("/", getServices);
serviceRouter.post("/", createService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;
