import { Router } from "express";
const routesRouter = Router();

routesRouter.get("/", (req, res) => {
  res.send("Routes routes is working");
});

export default routesRouter;
