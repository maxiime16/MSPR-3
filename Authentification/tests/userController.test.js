const userController = require("../controllers/userController");
const UserModel = require("../models/userModel");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// Mock des méthodes du modèle utilisateur, bcrypt et jwt
jest.mock("../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req, res;
  const originalConsoleError = console.error;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    console.error = jest.fn(); // Rediriger console.error vers une fonction de moquerie
  });

  afterEach(() => {
    console.error = originalConsoleError; // Restaurer console.error après les tests
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
        },
        {
          id: 2,
          first_name: "Jane",
          last_name: "Doe",
          email: "jane@example.com",
        },
      ];

      UserModel.getAll.mockResolvedValue(users);

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: users.map((user) => ({
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        })),
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      UserModel.getAll.mockRejectedValue(error);

      await userController.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getUserByEmail", () => {
    it("should return user by email", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      };

      req.params.email = "john@example.com";
      UserModel.getByEmail.mockResolvedValue(user);

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        },
      });
    });

    it("should return 404 if user not found", async () => {
      req.params.email = "john@example.com";
      UserModel.getByEmail.mockResolvedValue(null);

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.params.email = "john@example.com";
      UserModel.getByEmail.mockRejectedValue(error);

      await userController.getUserByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("getUserById", () => {
    it("should return user by ID", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      };

      req.params.id = 1;
      UserModel.getById.mockResolvedValue(user);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          },
        },
      });
    });

    it("should return 404 if user not found", async () => {
      req.params.id = 1;
      UserModel.getById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.params.id = 1;
      UserModel.getById.mockRejectedValue(error);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const newUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "hashedpassword",
      };

      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      UserModel.createUser.mockResolvedValue(newUser);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "Utilisateur créé avec succès." },
      });
    });

    it("should return 400 if user already exists", async () => {
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockResolvedValue({ id: 1 });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User with this email already exists." }],
      });
    });

    it("should return 400 if validation fails", async () => {
      req.body = {
        first_name: "",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: expect.any(String) }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockRejectedValue(error);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("updateUser", () => {
    it("should update an existing user", async () => {
      const updatedUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      };

      req.params.id = 1;
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      };

      UserModel.getById.mockResolvedValue({ id: 1 });
      UserModel.update.mockResolvedValue(updatedUser);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: updatedUser });
    });

    it("should return 404 if user not found", async () => {
      req.params.id = 1;
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      };

      UserModel.getById.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.params.id = 1;
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      };

      UserModel.getById.mockRejectedValue(error);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete an existing user", async () => {
      req.params.id = 1;

      UserModel.delete.mockResolvedValue();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "User deleted successfully." },
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.params.id = 1;

      UserModel.delete.mockRejectedValue(error);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("loginUser", () => {
    it("should login user and return token", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };

      req.body = {
        email: "john@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fake-jwt-token");

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          id: user.id,
          type: "user",
          attributes: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            token: "fake-jwt-token",
          },
        },
      });
    });

    it("should return 400 if validation fails", async () => {
      req.body = {
        email: "john@example.com",
        password: "",
      };

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: expect.any(String) }],
      });
    });

    it("should return 401 if email not found", async () => {
      req.body = {
        email: "john@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockResolvedValue(null);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Invalid email or password." }],
      });
    });

    it("should return 401 if password is incorrect", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };

      req.body = {
        email: "john@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Invalid email or password." }],
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Something went wrong");
      req.body = {
        email: "john@example.com",
        password: "password123",
      };

      UserModel.getByEmail.mockRejectedValue(error);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });
});
