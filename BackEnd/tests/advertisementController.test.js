const AdvertisementController = require("../controllers/advertisementController");
const AdvertisementModel = require("../models/advertisementModel");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const advertisementSchema = require("../schemas/advertisementSchema");

jest.mock("../models/advertisementModel");
jest.mock("../schemas/advertisementSchema", () => ({
  validate: jest.fn(),
}));

describe("Advertisement Controller", () => {
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

  describe("getAllAdvertisements", () => {
    it("should return 200 with all advertisements", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          id_user: 1,
          id_address: 1,
        },
        {
          id: 2,
          title: "Ad 2",
          start_date: "2023-07-01",
          end_date: "2023-07-30",
          id_user: 2,
          id_address: 2,
        },
      ];
      AdvertisementModel.getAll.mockResolvedValue(advertisements);

      await AdvertisementController.getAllAdvertisements(req, res);

      expect(AdvertisementModel.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: advertisements.map((ad) => ({
          type: "advertisements",
          id: ad.id,
          attributes: {
            title: ad.title,
            start_date: ad.start_date,
            end_date: ad.end_date,
            id_user: ad.id_user,
            id_address: ad.id_address,
          },
        })),
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getAll.mockRejectedValue(
        new Error("Something went wrong")
      );

      await AdvertisementController.getAllAdvertisements(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAdvertisementById", () => {
    it("should return 200 if advertisement is found", async () => {
      const advertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };
      AdvertisementModel.getById.mockResolvedValue(advertisement);
      req.params.id = "1";

      await AdvertisementController.getAdvertisementById(req, res);

      expect(AdvertisementModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "advertisements",
          id: advertisement.id,
          attributes: {
            title: advertisement.title,
            start_date: advertisement.start_date,
            end_date: advertisement.end_date,
            id_user: advertisement.id_user,
            id_address: advertisement.id_address,
          },
        },
      });
    });

    it("should return 400 if advertisement ID is missing", async () => {
      req.params.id = null;

      await AdvertisementController.getAdvertisementById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing advertisement ID" }],
      });
    });

    it("should return 404 if advertisement is not found", async () => {
      AdvertisementModel.getById.mockResolvedValue(null);
      req.params.id = "1";

      await AdvertisementController.getAdvertisementById(req, res);

      expect(AdvertisementModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisement not found" }],
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getById.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.id = "1";

      await AdvertisementController.getAdvertisementById(req, res);

      expect(AdvertisementModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAdvertisementByUserId", () => {
    it("should return 200 with advertisements for the user", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          id_user: 1,
          id_address: 1,
        },
      ];
      AdvertisementModel.getByUserId.mockResolvedValue(advertisements);
      req.params.user_id = "1";

      await AdvertisementController.getAdvertisementByUserId(req, res);

      expect(AdvertisementModel.getByUserId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: advertisements.map((ad) => ({
          type: "advertisements",
          id: ad.id,
          attributes: {
            title: ad.title,
            start_date: ad.start_date,
            end_date: ad.end_date,
            id_user: ad.id_user,
            id_address: ad.id_address,
          },
        })),
      });
    });

    it("should return 400 if user ID is missing", async () => {
      req.params.user_id = null;

      await AdvertisementController.getAdvertisementByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing user ID" }],
      });
    });

    it("should return 404 if no advertisements are found for the user", async () => {
      AdvertisementModel.getByUserId.mockResolvedValue([]);
      req.params.user_id = "1";

      await AdvertisementController.getAdvertisementByUserId(req, res);

      expect(AdvertisementModel.getByUserId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisements not found for this user" }],
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getByUserId.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.user_id = "1";

      await AdvertisementController.getAdvertisementByUserId(req, res);

      expect(AdvertisementModel.getByUserId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAdvertisementByAddressId", () => {
    it("should return 200 with advertisements for the address", async () => {
      const advertisements = [
        {
          id: 1,
          title: "Ad 1",
          start_date: "2023-06-01",
          end_date: "2023-06-30",
          id_user: 1,
          id_address: 1,
        },
      ];
      AdvertisementModel.getByAddressId.mockResolvedValue(advertisements);
      req.params.address_id = "1";

      await AdvertisementController.getAdvertisementByAddressId(req, res);

      expect(AdvertisementModel.getByAddressId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: advertisements.map((ad) => ({
          type: "advertisements",
          id: ad.id,
          attributes: {
            title: ad.title,
            start_date: ad.start_date,
            end_date: ad.end_date,
            id_user: ad.id_user,
            id_address: ad.id_address,
          },
        })),
      });
    });

    it("should return 400 if address ID is missing", async () => {
      req.params.address_id = null;

      await AdvertisementController.getAdvertisementByAddressId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing address ID" }],
      });
    });

    it("should return 404 if no advertisements are found for the address", async () => {
      AdvertisementModel.getByAddressId.mockResolvedValue([]);
      req.params.address_id = "1";

      await AdvertisementController.getAdvertisementByAddressId(req, res);

      expect(AdvertisementModel.getByAddressId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisements not found for this address" }],
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getByAddressId.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.address_id = "1";

      await AdvertisementController.getAdvertisementByAddressId(req, res);

      expect(AdvertisementModel.getByAddressId).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("createAdvertisement", () => {
    it("should return 201 and create an advertisement", async () => {
      const newAdvertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };
      advertisementSchema.validate.mockReturnValue({ error: null });
      AdvertisementModel.create.mockResolvedValue(newAdvertisement);
      req.body = {
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.createAdvertisement(req, res);

      expect(AdvertisementModel.create).toHaveBeenCalledWith({
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "advertisements",
          id: newAdvertisement.id,
          attributes: {
            title: newAdvertisement.title,
            start_date: newAdvertisement.start_date,
            end_date: newAdvertisement.end_date,
            id_user: newAdvertisement.id_user,
            id_address: newAdvertisement.id_address,
          },
        },
      });
    });

    it("should return 400 if validation fails", async () => {
      const validationError = { details: [{ message: "Validation error" }] };
      advertisementSchema.validate.mockReturnValue({ error: validationError });

      req.body = {
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.createAdvertisement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationError.details[0].message }],
      });
    });

    it("should handle errors", async () => {
      advertisementSchema.validate.mockReturnValue({ error: null });
      AdvertisementModel.create.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.body = {
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.createAdvertisement(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("deleteAdvertisement", () => {
    it("should return 204 and delete the advertisement", async () => {
      const deletedAdvertisement = {
        id: 1,
        title: "Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };
      AdvertisementModel.delete.mockResolvedValue(deletedAdvertisement);
      req.params.id = "1";

      await AdvertisementController.deleteAdvertisement(req, res);

      expect(AdvertisementModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "Advertisement deleted successfully." },
      });
    });

    it("should return 400 if advertisement ID is missing", async () => {
      req.params.id = null;

      await AdvertisementController.deleteAdvertisement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing advertisement ID" }],
      });
    });

    it("should return 404 if advertisement is not found", async () => {
      AdvertisementModel.delete.mockResolvedValue(null);
      req.params.id = "1";

      await AdvertisementController.deleteAdvertisement(req, res);

      expect(AdvertisementModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisement not found" }],
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.delete.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.id = "1";

      await AdvertisementController.deleteAdvertisement(req, res);

      expect(AdvertisementModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("updateAdvertisement", () => {
    it("should return 200 and update the advertisement", async () => {
      const updatedAdvertisement = {
        id: 1,
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };
      advertisementSchema.validate.mockReturnValue({ error: null });
      AdvertisementModel.update.mockResolvedValue(updatedAdvertisement);
      req.params.id = "1";
      req.body = {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.updateAdvertisement(req, res);

      expect(AdvertisementModel.update).toHaveBeenCalledWith("1", {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "advertisements",
          id: updatedAdvertisement.id,
          attributes: {
            title: updatedAdvertisement.title,
            start_date: updatedAdvertisement.start_date,
            end_date: updatedAdvertisement.end_date,
            id_user: updatedAdvertisement.id_user,
            id_address: updatedAdvertisement.id_address,
          },
        },
      });
    });

    it("should return 400 if validation fails", async () => {
      const validationError = { details: [{ message: "Validation error" }] };
      advertisementSchema.validate.mockReturnValue({ error: validationError });

      req.params.id = "1";
      req.body = {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.updateAdvertisement(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationError.details[0].message }],
      });
    });

    it("should return 404 if advertisement is not found", async () => {
      advertisementSchema.validate.mockReturnValue({ error: null });
      AdvertisementModel.update.mockResolvedValue(null);
      req.params.id = "1";
      req.body = {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.updateAdvertisement(req, res);

      expect(AdvertisementModel.update).toHaveBeenCalledWith("1", {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisement not found" }],
      });
    });

    it("should handle errors", async () => {
      advertisementSchema.validate.mockReturnValue({ error: null });
      AdvertisementModel.update.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.id = "1";
      req.body = {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      };

      await AdvertisementController.updateAdvertisement(req, res);

      expect(AdvertisementModel.update).toHaveBeenCalledWith("1", {
        title: "Updated Ad 1",
        start_date: "2023-06-01",
        end_date: "2023-06-30",
        id_user: 1,
        id_address: 1,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAdvertisementDetails", () => {
    it("should return 200 with advertisement details", async () => {
      const advertisementDetails = [
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
          firstimage: Buffer.from("image1"),
        },
      ];

      const expectedDetails = [
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
          firstimage: "aW1hZ2Ux",
        },
      ];

      AdvertisementModel.getAdvertisementDetails.mockResolvedValue(
        advertisementDetails
      );

      await AdvertisementController.getAdvertisementDetails(req, res);

      expect(AdvertisementModel.getAdvertisementDetails).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: expectedDetails,
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getAdvertisementDetails.mockRejectedValue(
        new Error("Something went wrong")
      );

      await AdvertisementController.getAdvertisementDetails(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAdvertisementDetailsById", () => {
    it("should return 200 if advertisement details are found", async () => {
      const advertisementDetails = {
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
      AdvertisementModel.getAdvertisementDetailsById.mockResolvedValue(
        advertisementDetails
      );
      req.params.id = "1";

      await AdvertisementController.getAdvertisementDetailsById(req, res);

      expect(
        AdvertisementModel.getAdvertisementDetailsById
      ).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: advertisementDetails,
      });
    });

    it("should return 400 if advertisement ID is missing", async () => {
      req.params.id = null;

      await AdvertisementController.getAdvertisementDetailsById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Missing advertisement ID" }],
      });
    });

    it("should return 404 if advertisement details are not found", async () => {
      AdvertisementModel.getAdvertisementDetailsById.mockResolvedValue(null);
      req.params.id = "1";

      await AdvertisementController.getAdvertisementDetailsById(req, res);

      expect(
        AdvertisementModel.getAdvertisementDetailsById
      ).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Advertisement not found" }],
      });
    });

    it("should handle errors", async () => {
      AdvertisementModel.getAdvertisementDetailsById.mockRejectedValue(
        new Error("Something went wrong")
      );
      req.params.id = "1";

      await AdvertisementController.getAdvertisementDetailsById(req, res);

      expect(
        AdvertisementModel.getAdvertisementDetailsById
      ).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });
});
