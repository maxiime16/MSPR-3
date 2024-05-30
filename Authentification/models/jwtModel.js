const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

class JWTModel {
  static async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            reject(new Error("Token expiré."));
          } else if (err.name === "JsonWebTokenError") {
            reject(new Error("Token invalide."));
          } else {
            reject(new Error("Erreur lors de la vérification du token."));
          }
        } else {
          resolve(decoded);
        }
      });
    });
  }
}

module.exports = JWTModel;
