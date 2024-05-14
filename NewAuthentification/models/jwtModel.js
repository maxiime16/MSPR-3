const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class JWTModel {
  static async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
            return resolve(false); // Indique un token invalide
          }
          return reject(err); // Indique une erreur serveur
        }
        resolve(decoded);
      });
    });
  }
}

module.exports = JWTModel;
