const jwt = require('jsonwebtoken');
const JWTModel = require('../models/jwtModel');

// Mock de la méthode jwt.verify
jest.mock('jsonwebtoken');

describe('JWT Model', () => {
  describe('verifyToken', () => {
    it('should return decoded token if valid', async () => {
      const decoded = { id: 1, email: 'test@example.com' };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      const result = await JWTModel.verifyToken('Bearer valid.token.here');

      expect(result).toEqual(decoded);
    });

    it('should throw an error if token is invalid', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      await expect(JWTModel.verifyToken('Bearer invalid.token.here')).rejects.toThrow('Invalid token');
    });

    it('should throw an error if jwt.verify throws', async () => {
      const error = new Error('Something went wrong');
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(error);
      });

      await expect(JWTModel.verifyToken('Bearer valid.token.here')).rejects.toThrow('Something went wrong');
    });
  });
});
