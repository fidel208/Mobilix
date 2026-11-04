const { Router } = require("express");
const communityRoutes = Router();

communityRoutes.get("/", (req, res) => {
  res.send("Community routes is working");
});

module.exports = communityRoutes;
