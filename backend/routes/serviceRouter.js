const { Router } = require("express");
const serviceRoutes = Router();

serviceRoutes.get("/", (req, res) => {
  res.send("Service routes is working");
});

module.exports = serviceRoutes;
