const ImageController = require("../controllers/imageController");
const ImageModel = require("../models/imageModel");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const imageSchema = require("../schemas/imageSchema");

jest.mock("../models/imageModel");
jest.mock("../schemas/imageSchema", () => ({
  validate: jest.fn(),
}));

describe("Image Controller", () => {
  let req, res;
  let consoleErrorMock;

  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    jest.clearAllMocks();
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe("getAllImages", () => {
    it("should return 200 with all images", async () => {
      const images = [
        { id: 1, image: Buffer.from("image1"), id_plant: 1 },
        { id: 2, image: Buffer.from("image2"), id_plant: 2 },
      ];
      const imagesWithBase64 = [
        { id: 1, image: "aW1hZ2Ux", id_plant: 1 },
        { id: 2, image: "aW1hZ2Uy", id_plant: 2 },
      ];
      ImageModel.getAll.mockResolvedValue(images);

      await ImageController.getAllImages(req, res);

      expect(ImageModel.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: imagesWithBase64 });
    });

    it("should handle errors", async () => {
      ImageModel.getAll.mockRejectedValue(new Error("Something went wrong"));

      await ImageController.getAllImages(req, res);

      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error fetching images: Something went wrong"));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getImageById", () => {
    it("should return 400 if image ID is missing", async () => {
      req.params.id = undefined;

      await ImageController.getImageById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing image ID" }],
      });
    });

    it("should return 200 if image is found", async () => {
      const image = { id: 1, image: Buffer.from("image1"), id_plant: 1 };
      ImageModel.getById.mockResolvedValue(image);
      req.params.id = "1";

      await ImageController.getImageById(req, res);

      expect(ImageModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { id: 1, image: "aW1hZ2Ux", id_plant: 1 },
      });
    });

    it("should return 404 if image is not found", async () => {
      ImageModel.getById.mockResolvedValue(null);
      req.params.id = "1";

      await ImageController.getImageById(req, res);

      expect(ImageModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Image not found" }],
      });
    });

    it("should handle errors", async () => {
      ImageModel.getById.mockRejectedValue(new Error("Something went wrong"));
      req.params.id = "1";

      await ImageController.getImageById(req, res);

      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error fetching image by ID: Something went wrong"));
      expect(ImageModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getImagesByPlantId", () => {
    it("should return 400 if plant ID is missing", async () => {
      req.params.id_plant = undefined;

      await ImageController.getImagesByPlantId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing plant ID" }],
      });
    });

    it("should return 200 with images for the plant", async () => {
      const images = [
        { id: 1, image: Buffer.from("image1"), id_plant: 1 },
      ];
      const imagesWithBase64 = [
        { id: 1, image: "aW1hZ2Ux", id_plant: 1 },
      ];
      ImageModel.getByPlantId.mockResolvedValue(images);
      req.params.id_plant = "1";

      await ImageController.getImagesByPlantId(req, res);

      expect(ImageModel.getByPlantId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: imagesWithBase64 });
    });

    it("should return 404 if no images are found for the plant", async () => {
      ImageModel.getByPlantId.mockResolvedValue([]);
      req.params.id_plant = "1";

      await ImageController.getImagesByPlantId(req, res);

      expect(ImageModel.getByPlantId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Images not found for this plant" }],
      });
    });

    it("should handle errors", async () => {
      ImageModel.getByPlantId.mockRejectedValue(new Error("Something went wrong"));
      req.params.id_plant = "1";

      await ImageController.getImagesByPlantId(req, res);

      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error fetching images by plant ID: Something went wrong"));
      expect(ImageModel.getByPlantId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("createImage", () => {
    it("should return 400 if validation fails", async () => {
      const validationError = { details: [{ message: "Validation error" }] };
      imageSchema.validate.mockReturnValue({ error: validationError });

      req.body = {
        image: "aW1hZ2Ux",
        id_Plant: 1,
      };

      await ImageController.createImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationError.details[0].message }],
      });
    });

    it("should return 201 and create an image", async () => {
      const newImage = { id: 1, image: Buffer.from("image1"), id_plant: 1 };
      imageSchema.validate.mockReturnValue({ error: null });
      ImageModel.create.mockResolvedValue(newImage);
      req.body = {
        image: "aW1hZ2Ux",
        id_Plant: 1,
      };

      await ImageController.createImage(req, res);

      expect(ImageModel.create).toHaveBeenCalledWith({
        image: "aW1hZ2Ux",
        id_Plant: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: newImage,
      });
    });

    it("should handle errors", async () => {
      imageSchema.validate.mockReturnValue({ error: null });
      ImageModel.create.mockRejectedValue(new Error("Something went wrong"));
      req.body = {
        image: "aW1hZ2Ux",
        id_Plant: 1,
      };

      await ImageController.createImage(req, res);

      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error creating image: Something went wrong"));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("deleteImage", () => {
    it("should return 400 if image ID is missing", async () => {
      req.params.id = undefined;

      await ImageController.deleteImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing image ID" }],
      });
    });

    it("should return 204 and delete the image", async () => {
      const deletedImage = { id: 1 };
      ImageModel.delete.mockResolvedValue(deletedImage);
      req.params.id = "1";

      await ImageController.deleteImage(req, res);

      expect(ImageModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 404 if image is not found", async () => {
      ImageModel.delete.mockResolvedValue(null);
      req.params.id = "1";

      await ImageController.deleteImage(req, res);

      expect(ImageModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Image not found" }],
      });
    });

    it("should handle errors", async () => {
      ImageModel.delete.mockRejectedValue(new Error("Something went wrong"));
      req.params.id = "1";

      await ImageController.deleteImage(req, res);

      expect(consoleErrorMock).toHaveBeenCalledWith(expect.stringContaining("Error deleting image: Something went wrong"));
      expect(ImageModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });
});
