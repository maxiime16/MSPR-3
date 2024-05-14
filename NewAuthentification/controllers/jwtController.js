const JWTModel = require("../models/jwtModel");

exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token JWT non fourni." });
  }

  try {
    await JWTModel.verifyToken(token);
    res.status(200).json({ message: "Token JWT valide." });
  } catch (error) {
    res.status(401).json({ error: "Token JWT invalide." });
  }
};
