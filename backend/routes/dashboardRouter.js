import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.get("/stats", getDashboardStats);

export default dashboardRouter;
