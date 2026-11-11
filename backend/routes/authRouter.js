import { Router } from "express";
import passport from "../config/passport.js";
import { register, login } from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validatorAuth.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, register);
authRouter.post(
  "/login",
  validateLogin,
  passport.authenticate("local", { session: false }),
  login,
);
authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
  },
);

export default authRouter;
