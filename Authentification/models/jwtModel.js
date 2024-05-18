const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

class JWTModel {
  static async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token.split(" ")[1],
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        }
      );
    });
  }
}

module.exports = JWTModel;
