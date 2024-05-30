const JWTModel = require("../models/jwtModel");

exports.verifyToken = async (req, res) => {
  const token = req.headers.authorization;
  console.log('token', token);

  if (!token) {
    return res.status(401).json({ error: "Token JWT non fourni." });
  }

  try {
    const decoded = await JWTModel.verifyToken(token);
    console.log('decoded', decoded);
    res.status(200).json({ message: "Token JWT valide.", user: decoded });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    if (error.message === "Token expiré." || error.message === "Token invalide.") {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error", detail: error.message });
    }
  }
};
