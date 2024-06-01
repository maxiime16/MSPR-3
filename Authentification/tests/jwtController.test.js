const JWTController = require("../controllers/jwtController");
const JWTModel = require("../models/jwtModel");
const { mockRequest, mockResponse } = require("../utils/testUtils");

// Mock des méthodes du modèle JWT
jest.mock("../models/jwtModel");

describe("JWT Controller", () => {
  let req, res;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
  });

  describe("verifyToken", () => {
    it("devrait retourner 200 si le token est valide", async () => {
      req.headers.authorization = "Bearer valid.token.here";
      const decodedToken = { id: 1, email: "test@example.com" };
      JWTModel.verifyToken.mockResolvedValue(decodedToken);

      await JWTController.verifyToken(req, res);

      expect(JWTModel.verifyToken).toHaveBeenCalledWith("valid.token.here");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Token JWT valide.",
        user: decodedToken,
      });
    });

    it("devrait retourner 401 si le token n'est pas fourni", async () => {
      req.headers.authorization = "";

      await JWTController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Token JWT non fourni." });
    });

    it("devrait retourner 401 si le token est invalide", async () => {
      req.headers.authorization = "Bearer invalid.token.here";
      JWTModel.verifyToken.mockRejectedValue(new Error("Token invalide."));

      await JWTController.verifyToken(req, res);

      expect(JWTModel.verifyToken).toHaveBeenCalledWith("invalid.token.here");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Token invalide." });
    });

    it("devrait gérer les erreurs", async () => {
      const error = new Error("Something went wrong");
      req.headers.authorization = "Bearer valid.token.here";
      JWTModel.verifyToken.mockRejectedValue(error);

      await JWTController.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
        detail: "Something went wrong",
      });
    });
  });
});
