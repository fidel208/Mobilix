const { Router } = require("express");
const ticketsRoutes = Router();

ticketsRoutes.get("/", (req, res) => {
  res.send("Tickets routes is working");
});

module.exports = ticketsRoutes;
