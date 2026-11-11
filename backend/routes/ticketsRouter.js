import { Router } from "express";
const ticketsRouter = Router();

ticketsRouter.get("/", (req, res) => {
  res.send("Tickets routes is working");
});

export default ticketsRouter;
