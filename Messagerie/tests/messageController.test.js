const MessageModel = require("../models/messageModel");
const MessageController = require("../controllers/messageController");
const { mockRequest, mockResponse } = require("../utils/testUtils");
const messageSchema = require("../schemas/messageSchema");

jest.mock("../models/messageModel");
jest.mock("../schemas/messageSchema");

describe("MessageController", () => {
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

  describe("getAllMessages", () => {
    it("should return all messages", async () => {
      const mockMessages = [{ id: 1 }, { id: 2 }];
      MessageModel.getAll.mockResolvedValue(mockMessages);

      const req = mockRequest();
      const res = mockResponse();

      await MessageController.getAllMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMessages });
    });

    it("should handle server error", async () => {
      MessageModel.getAll.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      const res = mockResponse();

      await MessageController.getAllMessages(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("getMessagesByConversationId", () => {
    it("should return messages by conversation ID", async () => {
      const mockMessages = [{ id: 1, conversation_id: 1 }];
      MessageModel.getByConversationId.mockResolvedValue(mockMessages);

      const req = mockRequest();
      req.params.conversation_id = 1;
      const res = mockResponse();

      await MessageController.getMessagesByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMessages });
    });

    it("should return 400 if conversation ID is missing", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await MessageController.getMessagesByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Missing conversation ID" }] });
    });

    it("should handle server error", async () => {
      MessageModel.getByConversationId.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      req.params.conversation_id = 1;
      const res = mockResponse();

      await MessageController.getMessagesByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("getMessageById", () => {
    it("should return a message by ID", async () => {
      const mockMessage = { id: 1 };
      MessageModel.getById.mockResolvedValue(mockMessage);

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await MessageController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockMessage });
    });

    it("should return 400 if message ID is missing", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await MessageController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Missing message ID" }] });
    });

    it("should handle server error", async () => {
      MessageModel.getById.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await MessageController.getMessageById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("createMessage", () => {
    it("should create a new message", async () => {
      const mockMessage = { id: 1, content: "Hello" };
      MessageModel.create.mockResolvedValue(mockMessage);
      messageSchema.validate.mockReturnValue({ value: mockMessage });

      const req = mockRequest();
      req.body = mockMessage;
      const res = mockResponse();

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockMessage });
    });

    it("should return 400 if validation fails", async () => {
      messageSchema.validate.mockReturnValue({ error: { details: [{ message: "Validation error" }] } });

      const req = mockRequest();
      req.body = { content: "Hello" };
      const res = mockResponse();

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Validation error" }] });
    });

    it("should handle server error", async () => {
      MessageModel.create.mockRejectedValue(new Error("Server Error"));
      messageSchema.validate.mockReturnValue({ value: { content: "Hello" } });

      const req = mockRequest();
      req.body = { content: "Hello" };
      const res = mockResponse();

      await MessageController.createMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message", async () => {
      MessageModel.delete.mockResolvedValue();

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 400 if message ID is missing", async () => {
      const req = mockRequest();
      const res = mockResponse();

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Missing message ID" }] });
    });

    it("should handle server error", async () => {
      MessageModel.delete.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await MessageController.deleteMessage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });
});
