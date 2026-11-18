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

authRouter.get("/google", (req, res, next) => {
  const returnTo =
    req.query.returnTo ||
    req.headers.referer ||
    process.env.CLIENT_URL ||
    "http://localhost:5173";
  const state = Buffer.from(returnTo).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    session: false,
  })(req, res, next);
});

authRouter.get(
  "/google/callback",
  (req, res, next) => {
    let failureUrl = process.env.CLIENT_URL || "http://localhost:5173";
    if (req.query.state) {
      try {
        const decoded = Buffer.from(req.query.state, "base64").toString("ascii");
        if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
          failureUrl = decoded.split("?")[0];
        }
      } catch (e) {
        
      }
    }

    passport.authenticate("google", {
      session: false,
      failureRedirect: `${failureUrl}?error=google_auth_failed`,
    })(req, res, next);
  },
  (req, res) => {
    let frontendURL = process.env.CLIENT_URL || "http://localhost:5173";
    if (req.query.state) {
      try {
        const decoded = Buffer.from(req.query.state, "base64").toString("ascii");
        if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
          frontendURL = decoded.split("?")[0];
        }
      } catch (e) {
        
      }
    }

    const token = jwt.sign(
      { userId: req.user.id, role: req.user.role || "CUSTOMER" },
      process.env.JWT_SECRET || "mobilix_super_secret_jwt_key_2026",
      {
        expiresIn: "24h",
      },
    );

    const { password: _, ...userSafe } = req.user;
    const userEncoded = encodeURIComponent(JSON.stringify(userSafe));

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
