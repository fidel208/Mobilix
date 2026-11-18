import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import "dotenv/config";
import express from "express";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import bookingRouter from "./routes/bookingRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import routesRouter from "./routes/routesRouter.js";
import ticketsRouter from "./routes/ticketsRouter.js";
import vehiclesRouter from "./routes/vehiclesRouter.js";
import communityRouter from "./routes/communityRouter.js";
import dashboardRouter from "./routes/dashboardRouter.js";
import mpesaRouter from "./routes/mpesaRouter.js";

import passport from "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    "https://mobilix-eight.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/services", serviceRouter);
app.use("/api/routes", routesRouter);
app.use("/api/tickets", ticketsRouter);
app.use("/api/vehicles", vehiclesRouter);
app.use("/api/community", communityRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/mpesa", mpesaRouter);

app.use("/services", serviceRouter);
app.use("/routes", routesRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/community", communityRouter);
app.use("/mpesa", mpesaRouter);

app.get("/", (req, res) => {
  res.send("Server is running succesfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
