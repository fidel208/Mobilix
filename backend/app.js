import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRouter from "./routes/authRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import routesRouter from "./routes/routesRouter.js";
import ticketsRouter from "./routes/ticketsRouter.js";
import vehiclesRouter from "./routes/vehiclesRouter.js";
import communityRouter from "./routes/communityRouter.js";

import passport from "./config/passport.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT;

const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/services", serviceRouter);
app.use("/routes", routesRouter);
app.use("/tickets", ticketsRouter);
app.use("/vehicles", vehiclesRouter);
app.use("/community", communityRouter);

app.use(passport.initialize());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Backend deveopment has started");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
