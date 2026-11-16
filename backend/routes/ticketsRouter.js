import { Router } from "express";
import {
  getTickets,
  searchTicket,
  createTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const ticketsRouter = Router();

ticketsRouter.get("/", getTickets);
ticketsRouter.get("/search", searchTicket);
ticketsRouter.post("/", createTicket);
ticketsRouter.delete("/:id", deleteTicket);

export default ticketsRouter;
