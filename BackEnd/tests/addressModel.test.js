const pool = require("../config/db");
const AddressModel = require("../models/addressModel");

// Mock de la méthode pool.query
jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

describe("AddressModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all addresses", async () => {
      const addresses = [
        { id: 1, City: "City1", Postal_code: 12345, Longitude: 1.23, Latitude: 4.56 },
        { id: 2, City: "City2", Postal_code: 67890, Longitude: 7.89, Latitude: 0.12 },
      ];
      pool.query.mockResolvedValue({ rows: addresses });

      const result = await AddressModel.getAll();

      expect(result).toEqual(addresses);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Address");
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AddressModel.getAll()).rejects.toThrow("Error retrieving addresses: Something went wrong");
    });
  });

  describe("getById", () => {
    it("should return address by ID", async () => {
      const address = { id: 1, City: "City1", Postal_code: 12345, Longitude: 1.23, Latitude: 4.56 };
      pool.query.mockResolvedValue({ rows: [address] });

      const result = await AddressModel.getById(1);

      expect(result).toEqual(address);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Address WHERE id = $1", [1]);
    });

    it("should return null if no address is found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AddressModel.getById(1);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Address WHERE id = $1", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AddressModel.getById(1)).rejects.toThrow("Error retrieving address: Something went wrong");
    });
  });

  describe("create", () => {
    it("should create a new address", async () => {
      const newAddress = { city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 };
      const createdAddress = { id: 1, City: "City1", Postal_code: 12345, Longitude: 1.23, Latitude: 4.56 };
      pool.query.mockResolvedValue({ rows: [createdAddress] });

      const result = await AddressModel.create(newAddress);

      expect(result).toEqual(createdAddress);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO Address (City, Postal_code, Longitude, Latitude) VALUES ($1, $2, $3, $4) RETURNING *",
        ["City1", 12345, 1.23, 4.56]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      const newAddress = { city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 };
      pool.query.mockRejectedValue(error);

      await expect(AddressModel.create(newAddress)).rejects.toThrow("Error creating address: Something went wrong");
    });
  });

  describe("delete", () => {
    it("should delete an existing address", async () => {
      const deletedAddress = { id: 1, City: "City1", Postal_code: 12345, Longitude: 1.23, Latitude: 4.56 };
      pool.query.mockResolvedValue({ rows: [deletedAddress] });

      const result = await AddressModel.delete(1);

      expect(result).toEqual(deletedAddress);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM Address WHERE id = $1 RETURNING *", [1]);
    });

    it("should return null if no address is found to delete", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AddressModel.delete(1);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM Address WHERE id = $1 RETURNING *", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AddressModel.delete(1)).rejects.toThrow("Error deleting address: Something went wrong");
    });
  });

  describe("update", () => {
    it("should update an existing address", async () => {
      const updatedAddress = { city: "City2", postal_code: 67890, longitude: 7.89, latitude: 0.12 };
      const returnedAddress = { id: 1, City: "City2", Postal_code: 67890, Longitude: 7.89, Latitude: 0.12 };
      pool.query.mockResolvedValue({ rows: [returnedAddress] });

      const result = await AddressModel.update(1, updatedAddress);

      expect(result).toEqual(returnedAddress);
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE Address SET City = $1, Postal_code = $2, Longitude = $3, Latitude = $4 WHERE id = $5 RETURNING *",
        ["City2", 67890, 7.89, 0.12, 1]
      );
    });

    it("should return null if no address is found to update", async () => {
      const updatedAddress = { city: "City2", postal_code: 67890, longitude: 7.89, latitude: 0.12 };
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AddressModel.update(1, updatedAddress);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE Address SET City = $1, Postal_code = $2, Longitude = $3, Latitude = $4 WHERE id = $5 RETURNING *",
        ["City2", 67890, 7.89, 0.12, 1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      const updatedAddress = { city: "City2", postal_code: 67890, longitude: 7.89, latitude: 0.12 };
      pool.query.mockRejectedValue(error);

      await expect(AddressModel.update(1, updatedAddress)).rejects.toThrow("Error updating address: Something went wrong");
    });
  });
});
