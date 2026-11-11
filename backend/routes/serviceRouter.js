import { Router } from "express";
const serviceRouter = Router();

serviceRouter.get("/", (req, res) => {
  res.send("Service routes is working");
});

export default serviceRouter;
