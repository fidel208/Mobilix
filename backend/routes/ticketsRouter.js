import { Router } from "express";
const ticketsRouter = Router();

import { getTickets } from "../controllers/ticketController.js";
import { searchTicket } from "../controllers/ticketController.js";

ticketsRouter.get("/", getTickets);
ticketsRouter.get("/search", searchTicket);

export default ticketsRouter;
