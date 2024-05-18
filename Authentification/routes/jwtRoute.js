const express = require("express");
const router = express.Router();
const JWTController = require("../controllers/jwtController");

router.post("/verifyToken", JWTController.verifyToken);

module.exports = router;
