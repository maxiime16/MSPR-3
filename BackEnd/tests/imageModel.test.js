const pool = require("../config/db");
const ImageModel = require("../models/imageModel");

jest.mock("../config/db", () => {
  return {
    query: jest.fn(),
  };
});

describe("ImageModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all images", async () => {
      const mockImages = [
        { id: 1, image: Buffer.from("image1", "base64"), id_plant: 1 },
        { id: 2, image: Buffer.from("image2", "base64"), id_plant: 2 },
      ];
      pool.query.mockResolvedValue({ rows: mockImages });

      const result = await ImageModel.getAll();

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Image");
      expect(result).toEqual(mockImages);
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("Something went wrong"));

      await expect(ImageModel.getAll()).rejects.toThrow("Error retrieving images: Something went wrong");
    });
  });

  describe("getById", () => {
    it("should return an image by id", async () => {
      const mockImage = { id: 1, image: Buffer.from("image1", "base64"), id_plant: 1 };
      pool.query.mockResolvedValue({ rows: [mockImage] });

      const result = await ImageModel.getById(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM Image I WHERE I.id = $1", [1]);
      expect(result).toEqual(mockImage);
    });

    it("should return null if no image is found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ImageModel.getById(1);

      expect(result).toBeNull();
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("Something went wrong"));

      await expect(ImageModel.getById(1)).rejects.toThrow("Error retrieving image: Something went wrong");
    });
  });

  describe("getByPlantId", () => {
    it("should return images by plant id", async () => {
      const mockImages = [
        { id: 1, image: Buffer.from("image1", "base64") },
        { id: 2, image: Buffer.from("image2", "base64") },
      ];
      pool.query.mockResolvedValue({ rows: mockImages });

      const result = await ImageModel.getByPlantId(1);

      expect(pool.query).toHaveBeenCalledWith("SELECT I.id, I.Image FROM Image I WHERE I.id_Plant = $1", [1]);
      expect(result).toEqual(mockImages);
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("Something went wrong"));

      await expect(ImageModel.getByPlantId(1)).rejects.toThrow("Error retrieving images: Something went wrong");
    });
  });

  describe("create", () => {
    it("should create an image", async () => {
      const mockImage = { id: 1, image: Buffer.from("image1", "base64"), id_plant: 1 };
      const imageData = { image: "aW1hZ2Ux", id_Plant: 1 };
      pool.query.mockResolvedValue({ rows: [mockImage] });

      const result = await ImageModel.create(imageData);

      expect(pool.query).toHaveBeenCalledWith("INSERT INTO Image (Image, id_Plant) VALUES ($1, $2) RETURNING *", [
        Buffer.from(imageData.image, "base64"),
        imageData.id_Plant,
      ]);
      expect(result).toEqual(mockImage);
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("Something went wrong"));

      await expect(ImageModel.create({ image: "aW1hZ2Ux", id_Plant: 1 })).rejects.toThrow("Error creating image: Something went wrong");
    });
  });

  describe("delete", () => {
    it("should delete an image by id", async () => {
      const mockDeletedImage = { id: 1 };
      pool.query.mockResolvedValue({ rows: [mockDeletedImage] });

      const result = await ImageModel.delete(1);

      expect(pool.query).toHaveBeenCalledWith("DELETE FROM Image I WHERE I.id = $1 RETURNING I.id", [1]);
      expect(result).toEqual(mockDeletedImage);
    });

    it("should return null if no image is found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await ImageModel.delete(1);

      expect(result).toBeNull();
    });

    it("should handle errors", async () => {
      pool.query.mockRejectedValue(new Error("Something went wrong"));

      await expect(ImageModel.delete(1)).rejects.toThrow("Error deleting image: Something went wrong");
    });
  });
});
