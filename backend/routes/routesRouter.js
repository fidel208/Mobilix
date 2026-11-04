const { Router } = require("express");
const routesRoutes = Router();

routesRoutes.get("/", (req, res) => {
  res.send("Routes routes is working");
});

module.exports = routesRoutes;
