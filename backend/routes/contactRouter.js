import { Router } from "express";
import { handleContactMessage } from "../controllers/contactController.js";

const contactRouter = Router();

contactRouter.post("/", handleContactMessage);

export default contactRouter;
