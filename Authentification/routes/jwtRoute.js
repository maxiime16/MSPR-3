const express = require("express");
const router = express.Router();
const JWTController = require("../controllers/jwtController");

router.post("/verifyToken", JWTController.verifyToken);

// Route générique pour /api/jwt
router.get("/", (req, res) => {
  res.status(200).send("JWT route is working");
});

module.exports = router;
