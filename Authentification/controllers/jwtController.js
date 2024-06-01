const JWTModel = require("../models/jwtModel");

exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Token JWT non fourni." });
  }

  try {
    const tokenWithoutBearer = token.replace(/^Bearer\s+/, ""); // Supprimer le préfixe "Bearer"
    const decoded = await JWTModel.verifyToken(tokenWithoutBearer);
    res.status(200).json({ message: "Token JWT valide.", user: decoded });
  } catch (error) {
    if (
      error.message === "Token expiré." ||
      error.message === "Token invalide."
    ) {
      res.status(401).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Internal Server Error", detail: error.message });
    }
  }
};
