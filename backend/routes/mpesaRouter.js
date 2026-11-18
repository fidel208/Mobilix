import { Router } from "express";
import { handleStkPush, handleMpesaCallback, checkPaymentStatus } from "../controllers/mpesaController.js";

const mpesaRouter = Router();

mpesaRouter.post("/stkpush", handleStkPush);

mpesaRouter.post("/callback", handleMpesaCallback);

mpesaRouter.get("/status/:checkoutRequestId", checkPaymentStatus);

export default mpesaRouter;
