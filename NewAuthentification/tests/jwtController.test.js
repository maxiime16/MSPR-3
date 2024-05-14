const JWTController = require('../controllers/jwtController');
const JWTModel = require('../models/jwtModel');
const { mockRequest, mockResponse } = require('../utils/testUtils');

// Mock des méthodes du modèle JWT
jest.mock('../models/jwtModel');

describe('JWT Controller', () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  describe('verifyToken', () => {
    it('should return 200 if token is valid', async () => {
      req.headers.authorization = 'Bearer valid.token.here';
      JWTModel.verifyToken.mockResolvedValue(true);

      await JWTController.verifyToken(req, res);

      expect(JWTModel.verifyToken).toHaveBeenCalledWith('Bearer valid.token.here');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token JWT valide.' });
    });

    it('should return 401 if token is not provided', async () => {
      req.headers.authorization = '';

      await JWTController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token JWT non fourni.' });
    });

    it('should return 401 if token is invalid', async () => {
      req.headers.authorization = 'Bearer invalid.token.here';
      JWTModel.verifyToken.mockResolvedValue(false); // Résoudre avec false pour indiquer un token invalide

      await JWTController.verifyToken(req, res);

      expect(JWTModel.verifyToken).toHaveBeenCalledWith('Bearer invalid.token.here');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Token JWT invalide.' });
    });

    it('should handle errors', async () => {
      const error = new Error('Something went wrong');
      req.headers.authorization = 'Bearer valid.token.here';
      JWTModel.verifyToken.mockRejectedValue(error);

      await JWTController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});
