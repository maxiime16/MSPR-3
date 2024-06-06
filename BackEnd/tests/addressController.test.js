const AddressController = require("../controllers/addressController");
const AddressModel = require("../models/addressModel");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const addressSchema = require("../schemas/addressSchema");

jest.mock("../models/addressModel");
jest.mock("../schemas/addressSchema", () => ({
  validate: jest.fn(),
}));

describe("Address Controller", () => {
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

  describe("getAllAddresses", () => {
    it("devrait retourner 200 avec la liste des adresses", async () => {
      const addresses = [
        { id: 1, city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 },
        { id: 2, city: "City2", postal_code: 67890, longitude: 7.89, latitude: 0.12 },
      ];
      AddressModel.getAll.mockResolvedValue(addresses);

      await AddressController.getAllAddresses(req, res);

      expect(AddressModel.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: addresses.map((address) => ({
          type: "addresses",
          id: address.id,
          attributes: {
            city: address.city,
            postal_code: address.postal_code,
            longitude: address.longitude,
            latitude: address.latitude,
          },
        })),
      });
    });

    it("devrait gérer les erreurs", async () => {
      AddressModel.getAll.mockRejectedValue(new Error("Something went wrong"));

      await AddressController.getAllAddresses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("getAddressById", () => {
    it("devrait retourner 200 si l'adresse est trouvée", async () => {
      const address = { id: 1, city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 };
      AddressModel.getById.mockResolvedValue(address);
      req.params.id = "1";

      await AddressController.getAddressById(req, res);

      expect(AddressModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "addresses",
          id: address.id,
          attributes: {
            city: address.city,
            postal_code: address.postal_code,
            longitude: address.longitude,
            latitude: address.latitude,
          },
        },
      });
    });

    it("devrait retourner 404 si l'adresse n'est pas trouvée", async () => {
      AddressModel.getById.mockResolvedValue(null);
      req.params.id = "1";

      await AddressController.getAddressById(req, res);

      expect(AddressModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Address not found" }],
      });
    });

    it("devrait gérer les erreurs", async () => {
      AddressModel.getById.mockRejectedValue(new Error("Something went wrong"));
      req.params.id = "1";

      await AddressController.getAddressById(req, res);

      expect(AddressModel.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("createAddress", () => {
    it("devrait retourner 201 et créer une adresse", async () => {
      const newAddress = { id: 1, city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 };
      addressSchema.validate.mockReturnValue({ error: null });
      AddressModel.create.mockResolvedValue(newAddress);
      req.body = {
        city: "City1",
        postal_code: 12345,
        longitude: 1.23,
        latitude: 4.56,
      };

      await AddressController.createAddress(req, res);

      expect(AddressModel.create).toHaveBeenCalledWith({
        city: "City1",
        postal_code: 12345,
        longitude: 1.23,
        latitude: 4.56,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "addresses",
          id: newAddress.id,
          attributes: {
            city: newAddress.city,
            postal_code: newAddress.postal_code,
            longitude: newAddress.longitude,
            latitude: newAddress.latitude,
          },
        },
      });
    });

    it("devrait retourner 400 en cas de validation échouée", async () => {
      const validationError = { details: [{ message: "Validation error" }] };
      addressSchema.validate.mockReturnValue({ error: validationError });

      req.body = {
        city: "City1",
        postal_code: 12345,
        longitude: 1.23,
        latitude: 4.56,
      };

      await AddressController.createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationError.details[0].message }],
      });
    });

    it("devrait gérer les erreurs", async () => {
      addressSchema.validate.mockReturnValue({ error: null });
      AddressModel.create.mockRejectedValue(new Error("Something went wrong"));
      req.body = {
        city: "City1",
        postal_code: 12345,
        longitude: 1.23,
        latitude: 4.56,
      };

      await AddressController.createAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("deleteAddress", () => {
    it("devrait retourner 204 et supprimer l'adresse", async () => {
      const deletedAddress = { id: 1, city: "City1", postal_code: 12345, longitude: 1.23, latitude: 4.56 };
      AddressModel.delete.mockResolvedValue(deletedAddress);
      req.params.id = "1";

      await AddressController.deleteAddress(req, res);

      expect(AddressModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: "Address deleted successfully." },
      });
    });

    it("devrait retourner 404 si l'adresse n'est pas trouvée", async () => {
      AddressModel.delete.mockResolvedValue(null);
      req.params.id = "1";

      await AddressController.deleteAddress(req, res);

      expect(AddressModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Address not found" }],
      });
    });

    it("devrait gérer les erreurs", async () => {
      AddressModel.delete.mockRejectedValue(new Error("Something went wrong"));
      req.params.id = "1";

      await AddressController.deleteAddress(req, res);

      expect(AddressModel.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });

  describe("updateAddress", () => {
    it("devrait retourner 200 et mettre à jour l'adresse", async () => {
      const updatedAddress = { id: 1, city: "City2", postal_code: 67890, longitude: 7.89, latitude: 0.12 };
      addressSchema.validate.mockReturnValue({ error: null });
      AddressModel.update.mockResolvedValue(updatedAddress);
      req.params.id = "1";
      req.body = {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      };

      await AddressController.updateAddress(req, res);

      expect(AddressModel.update).toHaveBeenCalledWith("1", {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          type: "addresses",
          id: updatedAddress.id,
          attributes: {
            city: updatedAddress.city,
            postal_code: updatedAddress.postal_code,
            longitude: updatedAddress.longitude,
            latitude: updatedAddress.latitude,
          },
        },
      });
    });

    it("devrait retourner 400 en cas de validation échouée", async () => {
      const validationError = { details: [{ message: "Validation error" }] };
      addressSchema.validate.mockReturnValue({ error: validationError });

      req.params.id = "1";
      req.body = {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      };

      await AddressController.updateAddress(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: validationError.details[0].message }],
      });
    });

    it("devrait retourner 404 si l'adresse n'est pas trouvée", async () => {
      addressSchema.validate.mockReturnValue({ error: null });
      AddressModel.update.mockResolvedValue(null);
      req.params.id = "1";
      req.body = {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      };

      await AddressController.updateAddress(req, res);

      expect(AddressModel.update).toHaveBeenCalledWith("1", {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Address not found" }],
      });
    });

    it("devrait gérer les erreurs", async () => {
      addressSchema.validate.mockReturnValue({ error: null });
      AddressModel.update.mockRejectedValue(new Error("Something went wrong"));
      req.params.id = "1";
      req.body = {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      };

      await AddressController.updateAddress(req, res);

      expect(AddressModel.update).toHaveBeenCalledWith("1", {
        city: "City2",
        postal_code: 67890,
        longitude: 7.89,
        latitude: 0.12,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        errors: [{ message: "Server Error" }],
      });
    });
  });
});
