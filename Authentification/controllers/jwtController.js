const JWTModel = require("../models/jwtModel");

exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token JWT non fourni." });
  }

  try {
    const isValid = await JWTModel.verifyToken(token);
    if (!isValid) {
      return res.status(401).json({ error: "Token JWT invalide." });
    }
    res.status(200).json({ message: "Token JWT valide." });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
