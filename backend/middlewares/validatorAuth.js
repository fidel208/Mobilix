import { body, validationResult } from "express-validator";

export const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
];

export const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
];

export const validateBooking = [
  body("serviceType").trim().notEmpty().withMessage("Service type is required"),
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("startingPoint")
    .trim()
    .notEmpty()
    .withMessage("Starting point is required"),
  body("destination").trim().notEmpty().withMessage("Destination is required"),
  body("travelDate").trim().notEmpty().withMessage("Travel date is required"),
  body("paymentType")
    .customSanitizer((value) => {
      if (typeof value !== "string") return value;
      return value.trim().toLowerCase().replace(/[_-]+/g, " ");
    })
    .notEmpty()
    .withMessage("Payment type is required")
    .isIn(["now", "arrival", "payment on arrival"])
    .withMessage("Payment type must be 'now' or 'arrival'"),
  body("seats")
    .custom((value) => {
      const seatCount = Number(value);
      if (!Number.isInteger(seatCount) || seatCount < 1) {
        throw new Error("Seats must be a whole number greater than 0");
      }
      return true;
    })
    .customSanitizer((value) => Number.parseInt(value, 10)),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
];

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "error",
      message: "Access forbidden: Admin access only.",
    });
  }
  next();
};
