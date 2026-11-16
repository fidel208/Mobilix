import { Router } from "express";
import { createBooking } from "../controllers/bookingController.js";
import { validateBooking } from "../middlewares/validatorAuth.js";

const bookingRouter = Router();

bookingRouter.post("/", validateBooking, createBooking);

export default bookingRouter;
