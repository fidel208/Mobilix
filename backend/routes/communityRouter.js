import { Router } from "express";
const communityRouter = Router();

communityRouter.get("/", (req, res) => {
  res.send("Community routes is working");
});

export default communityRouter;
