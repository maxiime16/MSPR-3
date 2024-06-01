const jwt = require("jsonwebtoken");
const JWTModel = require("../models/jwtModel");

// Mock de la méthode jwt.verify
jest.mock("jsonwebtoken");

describe("JWT Model", () => {
  describe("verifyToken", () => {
    it("devrait retourner le token décodé s'il est valide", async () => {
      const decoded = { id: 1, email: "test@example.com" };
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, decoded);
      });

      const result = await JWTModel.verifyToken("valid.token.here");

      expect(result).toEqual(decoded);
    });

    it("devrait renvoyer une erreur si le token est invalide", async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback({ name: "JsonWebTokenError" });
      });

      await expect(JWTModel.verifyToken("invalid.token.here")).rejects.toThrow(
        "Token invalide."
      );
    });

    it("devrait renvoyer une erreur si jwt.verify renvoie une erreur différente", async () => {
      const error = new Error("Something went wrong");
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(error);
      });

      await expect(JWTModel.verifyToken("valid.token.here")).rejects.toThrow(
        "Erreur lors de la vérification du token."
      );
    });
  });
});
