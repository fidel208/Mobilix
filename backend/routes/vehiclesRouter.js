import { Router } from "express";
const vehiclesRouter = Router();

vehiclesRouter.get("/", (req, res) => {
  res.send("Vehicles routes is working");
});

export default vehiclesRouter;
