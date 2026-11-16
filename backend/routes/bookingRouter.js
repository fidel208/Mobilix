import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";

const bookingRouter = Router();

bookingRouter.post("/", createBooking);

export default bookingRouter;
