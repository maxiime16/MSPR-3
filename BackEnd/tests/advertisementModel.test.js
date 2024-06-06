const pool = require("../config/db");
const AdvertisementModel = require("../models/advertisementModel");

jest.mock("../config/db", () => ({
  query: jest.fn(),
}));

describe("AdvertisementModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all advertisements", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          creation_date: "2023-05-01",
          id_User: 1,
          id_Address: 1,
        },
        {
          id: 2,
          title: "Ad 2",
          start_date: "2023-07-01",
          end_date: "2023-07-30",
          creation_date: "2023-06-01",
          id_User: 2,
          id_Address: 2,
        },
      ];
      pool.query.mockResolvedValue({ rows: advertisements });

      const result = await AdvertisementModel.getAll();

      expect(result).toEqual(advertisements);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement");
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getAll()).rejects.toThrow("Error retrieving advertisements: Something went wrong");
    });
  });

  describe("getById", () => {
    it("should return advertisement by ID", async () => {
      const advertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        creation_date: "2023-05-01",
        id_User: 1,
        id_Address: 1,
      };
      pool.query.mockResolvedValue({ rows: [advertisement] });

      const result = await AdvertisementModel.getById(1);

      expect(result).toEqual(advertisement);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id = $1", [1]);
    });

    it("should return null if advertisement not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.getById(1);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id = $1", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getById(1)).rejects.toThrow("Error retrieving advertisement: Something went wrong");
    });
  });

  describe("getByUserId", () => {
    it("should return advertisements by user ID", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          creation_date: "2023-05-01",
          id_User: 1,
          id_Address: 1,
        },
      ];
      pool.query.mockResolvedValue({ rows: advertisements });

      const result = await AdvertisementModel.getByUserId(1);

      expect(result).toEqual(advertisements);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id_User = $1", [1]);
    });

    it("should return an empty array if no advertisements found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.getByUserId(1);

      expect(result).toEqual([]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id_User = $1", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getByUserId(1)).rejects.toThrow("Error retrieving advertisements for user: Something went wrong");
    });
  });

  describe("getByAddressId", () => {
    it("should return advertisements by address ID", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          creation_date: "2023-05-01",
          id_User: 1,
          id_Address: 1,
        },
      ];
      pool.query.mockResolvedValue({ rows: advertisements });

      const result = await AdvertisementModel.getByAddressId(1);

      expect(result).toEqual(advertisements);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id_Address = $1", [1]);
    });

    it("should return an empty array if no advertisements found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.getByAddressId(1);

      expect(result).toEqual([]);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Advertisement WHERE id_Address = $1", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getByAddressId(1)).rejects.toThrow("Error retrieving advertisements for address: Something went wrong");
    });
  });

  describe("create", () => {
    it("should create a new advertisement", async () => {
      const newAdvertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        creation_date: "2023-05-01",
        id_User: 1,
        id_Address: 1,
      };
      pool.query.mockResolvedValue({ rows: [newAdvertisement] });

      const result = await AdvertisementModel.create({
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });

      expect(result).toEqual(newAdvertisement);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO Advertisement (Title, start_date, end_date, id_User, id_Address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        ["Ad 1", "2023-06-01", "2023-06-30", 1, 1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(
        AdvertisementModel.create({
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          id_user: 1,
          id_address: 1,
        })
      ).rejects.toThrow("Error creating advertisement: Something went wrong");
    });
  });

  describe("delete", () => {
    it("should delete an advertisement by ID", async () => {
      const deletedAdvertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        creation_date: "2023-05-01",
        id_User: 1,
        id_Address: 1,
      };
      pool.query.mockResolvedValue({ rows: [deletedAdvertisement] });

      const result = await AdvertisementModel.delete(1);

      expect(result).toEqual(deletedAdvertisement);
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM Advertisement WHERE id = $1 RETURNING *", [1]);
    });

    it("should return null if advertisement not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.delete(1);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith("DELETE FROM Advertisement WHERE id = $1 RETURNING *", [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.delete(1)).rejects.toThrow("Error deleting advertisement: Something went wrong");
    });
  });

  describe("update", () => {
    it("should update an advertisement by ID", async () => {
      const updatedAdvertisement = {
        id: 1,
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        creation_date: "2023-05-01",
        id_User: 1,
        id_Address: 1,
      };
      pool.query.mockResolvedValue({ rows: [updatedAdvertisement] });

      const result = await AdvertisementModel.update(1, {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });

      expect(result).toEqual(updatedAdvertisement);
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE Advertisement SET Title = $1, start_date = $2, end_date = $3, id_User = $4, id_Address = $5 WHERE id = $6 RETURNING *",
        ["Updated Ad 1", "2023-06-01", "2023-06-30", 1, 1, 1]
      );
    });

    it("should return null if advertisement not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.update(1, {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE Advertisement SET Title = $1, start_date = $2, end_date = $3, id_User = $4, id_Address = $5 WHERE id = $6 RETURNING *",
        ["Updated Ad 1", "2023-06-01", "2023-06-30", 1, 1, 1]
      );
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(
        AdvertisementModel.update(1, {
          title: "Updated Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          id_user: 1,
          id_address: 1,
        })
      ).rejects.toThrow("Error updating advertisement: Something went wrong");
    });
  });

  describe("getAdvertisementDetails", () => {
    it("should return advertisement details", async () => {
      const details = [
        {
          id: 1,
          AdvertisementTitle: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          creation_date: "2023-05-01",
          City: "City1",
          Postal_code: 12345,
          SubCategoryName: "SubCategory1",
          CategoryName: "Category1",
          FirstImage: "image1",
        },
      ];
      pool.query.mockResolvedValue({ rows: details });

      const result = await AdvertisementModel.getAdvertisementDetails();

      expect(result).toEqual(details);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"));
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getAdvertisementDetails()).rejects.toThrow("Error retrieving advertisement details: Something went wrong");
    });
  });

  describe("getAdvertisementDetailsById", () => {
    it("should return advertisement details by ID", async () => {
      const detail = {
        AdvertisementTitle: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        creation_date: "2023-05-01",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        City: "City1",
        Postal_Code: 12345,
        Longitude: 1.23,
        Latitude: 4.56,
      };
      pool.query.mockResolvedValue({ rows: [detail] });

      const result = await AdvertisementModel.getAdvertisementDetailsById(1);

      expect(result).toEqual(detail);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [1]);
    });

    it("should return null if advertisement not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await AdvertisementModel.getAdvertisementDetailsById(1);

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("SELECT"), [1]);
    });

    it("should throw an error if query fails", async () => {
      const error = new Error("Something went wrong");
      pool.query.mockRejectedValue(error);

      await expect(AdvertisementModel.getAdvertisementDetailsById(1)).rejects.toThrow("Error retrieving advertisement: Something went wrong");
    });
  });
});
