const jwt = require('jsonwebtoken');

class JWTModel {
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token.split(' ')[1], 'test');
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = JWTModel;