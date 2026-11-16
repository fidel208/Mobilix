import { Router } from "express";
import {
  getRoutes,
  createRoute,
  deleteRoute,
} from "../controllers/routeController.js";

const routesRouter = Router();

routesRouter.get("/", getRoutes);
routesRouter.post("/", createRoute);
routesRouter.delete("/:id", deleteRoute);

export default routesRouter;
