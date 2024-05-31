const pool = require("../config/db");
const UserModel = require("../models/userModel");

// Mock de la méthode pool.query
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

describe("UserModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
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
      pool.query.mockResolvedValue({ rows: users });

      const result = await UserModel.getAll();

      expect(result).toEqual(users);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Users");
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(UserModel.getAll()).rejects.toThrow("Something went wrong");
    });
  });

  describe("getByEmail", () => {
    it("should return user by email", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      };
      pool.query.mockResolvedValue({ rows: [user] });

      const result = await UserModel.getByEmail("john@example.com");

      expect(result).toEqual(user);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM Users WHERE Email = $1',
        ["john@example.com"]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(UserModel.getByEmail("john@example.com")).rejects.toThrow(
        "Something went wrong"
      );
    });
  });

  describe("getById", () => {
    it("should return user by ID", async () => {
      const user = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      };
      pool.query.mockResolvedValue({ rows: [user] });

      const result = await UserModel.getById(1);

      expect(result).toEqual(user);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM Users WHERE Users.id = $1',
        [1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(UserModel.getById(1)).rejects.toThrow(
        "Something went wrong"
      );
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const newUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };
      pool.query.mockResolvedValue({ rows: [newUser] });

      const result = await UserModel.createUser(newUser);

      expect(result).toEqual(newUser);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO Users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        ["John", "Doe", "john@example.com", "hashedpassword"]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      const newUser = {
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        password: "hashedpassword",
      };
      pool.query.mockRejectedValue(error);

      await expect(UserModel.createUser(newUser)).rejects.toThrow(
        "Something went wrong"
      );
    });
  });

  describe("update", () => {
    it("should update an existing user", async () => {
      const updatedUser = {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      };
      pool.query.mockResolvedValue({ rows: [updatedUser] });

      const result = await UserModel.update(1, {
        first_name: "John",
        last_name: "Doe",
        email: "john_updated@example.com",
      });

      expect(result).toEqual(updatedUser);
      expect(pool.query).toHaveBeenCalledWith(
        'UPDATE Users SET Users.email = $1, Users.first_name = $2, Users.last_name = $3 WHERE Users.id = $4 RETURNING *',
        ["john_updated@example.com", "John", "Doe", 1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(
        UserModel.update(1, {
          first_name: "John",
          last_name: "Doe",
          email: "john_updated@example.com",
        })
      ).rejects.toThrow("Something went wrong");
    });
  });

  describe("delete", () => {
    it("should delete an existing user", async () => {
      pool.query.mockResolvedValue();

      await expect(UserModel.delete(1)).resolves.not.toThrow();
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM Users WHERE Users.id = $1",
        [1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(UserModel.delete(1)).rejects.toThrow("Something went wrong");
    });
  });
});
