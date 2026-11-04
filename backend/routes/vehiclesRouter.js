const { Router } = require("express");
const vehiclesRoutes = Router();

vehiclesRoutes.get("/", (req, res) => {
  res.send("Vehicles routes is working");
});

module.exports = vehiclesRoutes;
