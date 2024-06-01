const UserController = require("../controllers/userController");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { mockRequest, mockResponse } = require("../utils/testUtils");

jest.mock("../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Controller", () => {
  let req, res;
  let consoleErrorMock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
    consoleErrorMock = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe("getAll", () => {
    it("devrait retourner 200 avec la liste des utilisateurs", async () => {
      const users = [
        {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
        },
        {
          id: 2,
          firstname: "Jane",
          lastname: "Doe",
          email: "jane@example.com",
        },
      ];
      UserModel.getAll.mockResolvedValue(users);

      await UserController.getAll(req, res);

      expect(UserModel.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: users.map((user) => ({
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
          },
        })),
      });
    });
  });

  describe("getUserByEmail", () => {
    it("devrait retourner 200 si l'utilisateur est trouvé", async () => {
      const user = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };
      UserModel.getByEmail.mockResolvedValue(user);
      req.params.email = "john@example.com";

      await UserController.getUserByEmail(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
          },
        },
      });
    });

    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      UserModel.getByEmail.mockResolvedValue(null);
      req.params.email = "unknown@example.com";

      await UserController.getUserByEmail(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("unknown@example.com");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });
  });

  describe("getUserById", () => {
    it("devrait retourner 200 si l'utilisateur est trouvé", async () => {
      const user = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };
      UserModel.getById.mockResolvedValue(user);
      req.params.id = 1;

      await UserController.getUserById(req, res);

      expect(UserModel.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "user",
          id: user.id,
          attributes: {
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
          },
        },
      });
    });

    it("devrait retourner 404 si l'utilisateur n'est pas trouvé", async () => {
      UserModel.getById.mockResolvedValue(null);
      req.params.id = 1;

      await UserController.getUserById(req, res);

      expect(UserModel.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });
  });

  describe("createUser", () => {
    it("devrait retourner 201 et créer un utilisateur", async () => {
      const newUser = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };
      UserModel.getByEmail.mockResolvedValue(null);
      UserModel.createUser.mockResolvedValue(newUser);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "password123",
      };

      await UserController.createUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(UserModel.createUser).toHaveBeenCalledWith({
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "Utilisateur créé avec succès." },
      });
    });

    it("devrait retourner 400 si l'utilisateur existe déjà", async () => {
      const existingUser = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };
      UserModel.getByEmail.mockResolvedValue(existingUser);
      req.body = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "password123",
      };

      await UserController.createUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User with this email already exists." }],
      });
    });
  });

  describe("updateUser", () => {
    it("devrait retourner 200 et mettre à jour l'utilisateur", async () => {
      const existingUser = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
      };
      const updatedUser = {
        id: 1,
        firstname: "Johnny",
        lastname: "Doe",
        email: "john@example.com",
      };
      UserModel.getById.mockResolvedValue(existingUser);
      UserModel.update.mockResolvedValue(updatedUser);
      req.params.id = 1;
      req.body = {
        first_name: "Johnny",
        last_name: "Doe",
        email: "john@example.com",
      };

      await UserController.updateUser(req, res);

      expect(UserModel.getById).toHaveBeenCalledWith(1);
      expect(UserModel.update).toHaveBeenCalledWith(1, {
        first_name: "Johnny",
        last_name: "Doe",
        email: "john@example.com",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "user",
          id: updatedUser.id,
          attributes: {
            first_name: updatedUser.firstname,
            last_name: updatedUser.lastname,
            email: updatedUser.email,
          },
        },
      });
    });

    it("devrait retourner 404 si l'utilisateur n'existe pas", async () => {
      UserModel.getById.mockResolvedValue(null);
      req.params.id = 1;
      req.body = {
        first_name: "Johnny",
        last_name: "Doe",
        email: "john@example.com",
      };

      await UserController.updateUser(req, res);

      expect(UserModel.getById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "User not found." }],
      });
    });
  });

  describe("deleteUser", () => {
    it("devrait retourner 200 et supprimer l'utilisateur", async () => {
      UserModel.delete.mockResolvedValue();
      req.params.id = 1;

      await UserController.deleteUser(req, res);

      expect(UserModel.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "User deleted successfully." },
      });
    });

    it("devrait retourner 500 en cas d'erreur", async () => {
      UserModel.delete.mockRejectedValue(new Error("Error deleting user"));
      req.params.id = 1;

      await UserController.deleteUser(req, res);

      expect(UserModel.delete).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });

  describe("loginUser", () => {
    it("devrait retourner 200 et un token JWT si les identifiants sont valides", async () => {
      const user = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };
      UserModel.getByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("valid.jwt.token");
      req.body = { email: "john@example.com", password: "password123" };

      await UserController.loginUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedpassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: user.id,
          email: user.email,
          first_name: user.firstname,
          last_name: user.lastname,
        },
        process.env.JWT_SECRET
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          id: user.id,
          type: "user",
          attributes: {
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
            token: "valid.jwt.token",
          },
        },
      });
    });

    it("devrait retourner 401 si l'email est invalide", async () => {
      UserModel.getByEmail.mockResolvedValue(null);
      req.body = { email: "unknown@example.com", password: "password123" };

      await UserController.loginUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("unknown@example.com");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Invalid email or password." }],
      });
    });

    it("devrait retourner 401 si le mot de passe est invalide", async () => {
      const user = {
        id: 1,
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };
      UserModel.getByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      req.body = { email: "john@example.com", password: "invalidpassword" };

      await UserController.loginUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "invalidpassword",
        "hashedpassword"
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Invalid email or password." }],
      });
    });

    it("devrait retourner 500 en cas d'erreur lors de la connexion", async () => {
      UserModel.getByEmail.mockRejectedValue(new Error("Error during login"));
      req.body = { email: "john@example.com", password: "password123" };

      await UserController.loginUser(req, res);

      expect(UserModel.getByEmail).toHaveBeenCalledWith("john@example.com");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ title: "Server Error" }],
      });
    });
  });
});
