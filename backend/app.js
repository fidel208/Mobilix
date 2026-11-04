const express = require("express");
const app = express();
const serviceRoutes = require("./routes/serviceRouter.js");
const routesRoutes = require("./routes/routesRouter.js");
const ticketsRoutes = require("./routes/ticketsRouter.js");
const vehiclesRoutes = require("./routes/vehiclesRouter.js");
const communityRoutes = require("./routes/communityRouter.js");

require("dotenv").config();
const PORT = process.env.PORT;

app.use("/services", serviceRoutes);
app.use("/routes", routesRoutes);
app.use("/tickets", ticketsRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/community", communityRoutes);

app.get("/", (req, res) => {
  res.send("Backend deveopment has started");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
