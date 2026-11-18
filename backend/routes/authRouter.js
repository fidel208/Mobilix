import { Router } from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
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

authRouter.post("/admin/login", validateLogin, adminLogin);

authRouter.post(
  "/admin/register",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  validateRegister,
  adminRegister,
);

authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}?error=google_auth_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userEncoded = encodeURIComponent(JSON.stringify(req.user));
    const frontendURL = process.env.CLIENT_URL;

    res.redirect(`${frontendURL}?token=${token}&user=${userEncoded}`);
  },
);

authRouter.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.status(200).json({ status: "success", user: req.user });
  },
);

authRouter.get(
  "/admin/me",
  passport.authenticate("jwt", { session: false }),
  requireAdmin,
  (req, res) => {
    res.status(200).json({ status: "success", admin: req.user });
  },
);

export default authRouter;
