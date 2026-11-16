import { Router } from "express";
import passport from "../config/passport.js";
import {
  register,
  login,
  adminLogin,
  adminRegister,
} from "../controllers/authController.js";
import {
  validateRegister,
  validateLogin,
  requireAdmin,
} from "../middlewares/validatorAuth.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, register);

// User login
authRouter.post("/login", validateLogin, (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: info?.message || "Invalid email or password.",
      });
    }
    req.user = user;
    login(req, res);
  })(req, res, next);
});

// Admin login
authRouter.post("/admin/login", validateLogin, adminLogin);

// Admin register (Only existing authenticated admins can register another admin)
authRouter.post(
  "/admin/register",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  validateRegister,
  adminRegister,
);

// Current authenticated user (User or Admin)
authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
  },
);

// Current authenticated admin profile
authRouter.get(
  "/admin/me",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  (req, res) => {
    res.status(200).json({ status: "success", admin: req.user });
  },
);

export default authRouter;
