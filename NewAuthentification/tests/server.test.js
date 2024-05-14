const request = require("supertest");
const app = require("../server"); // Importer le fichier server.js
const UserModel = require('../models/userModel');
const JWTModel = require('../models/jwtModel'); // Importer le modèle JWT

// Mock des méthodes du modèle utilisateur et JWT
jest.mock('../models/userModel');
jest.mock('../models/jwtModel');

describe("Server", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 for the Swagger docs route", async () => {
    const res = await request(app).get("/api/doc/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Swagger");
  });

  it("should return 404 for unknown routes", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.statusCode).toEqual(404);
    expect(res.text).toEqual("Page not found");
  });

  it("should handle JSON parse errors", async () => {
    const res = await request(app)
      .post("/api/user")
      .send("invalid json")
      .set("Content-Type", "application/json");
    expect(res.statusCode).toEqual(400); // Changement attendu
    expect(res.body).toHaveProperty("error", "Bad JSON");
  });

  // Tests pour les routes utilisateur
  it("should get all users", async () => {
    const users = [
      { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
      { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' }
    ];
    UserModel.getAll.mockResolvedValue(users);

    const res = await request(app).get("/api/user");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should create a new user", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    UserModel.createUser.mockResolvedValue(newUser);

    const res = await request(app).post("/api/user").send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("data.message", "Utilisateur créé avec succès.");
  });

  it("should return user by email", async () => {
    const user = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' };
    UserModel.getByEmail.mockResolvedValue(user);

    const res = await request(app).get(`/api/user/email/john.doe@example.com`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
  });

  it("should return 404 if user not found by email", async () => {
    UserModel.getByEmail.mockResolvedValue(null);

    const res = await request(app).get(`/api/user/email/nonexistent@example.com`);
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("errors");
  });

  // Tests pour les routes JWT
  it("should verify a valid JWT token", async () => {
    const token = "Bearer valid.token.here";
    JWTModel.verifyToken.mockResolvedValue(true); // Mock de verifyToken

    const res = await request(app).post("/api/jwt/verifyToken").set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Token JWT valide.");
  });

  it("should return 401 if JWT token is not provided", async () => {
    const res = await request(app).post("/api/jwt/verifyToken");
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token JWT non fourni.");
  });

  it("should return 401 if JWT token is invalid", async () => {
    const token = "Bearer invalid.token.here";
    JWTModel.verifyToken.mockResolvedValue(false); // Mock de verifyToken

    const res = await request(app).post("/api/jwt/verifyToken").set("Authorization", token);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("error", "Token JWT invalide.");
  });
});
