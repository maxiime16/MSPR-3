// tests/conversationController.test.js
const ConversationModel = require("../models/conversationModel");
const ConversationController = require("../controllers/conversationController");
const { mockRequest, mockResponse } = require("../utils/testUtils");

jest.mock("../models/conversationModel");

describe("ConversationController", () => {
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
  
  describe("getAllConversations", () => {
    it("should return all conversations", async () => {
      const mockConversations = [
        { id: 1, created_at: new Date() },
        { id: 2, created_at: new Date() },
      ];

      ConversationModel.getAll.mockResolvedValue(mockConversations);

      const req = mockRequest();
      const res = mockResponse();

      await ConversationController.getAllConversations(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockConversations });
    });

    it("should handle server error", async () => {
      ConversationModel.getAll.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      const res = mockResponse();

      await ConversationController.getAllConversations(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("getConversationById", () => {
    it("should return a conversation by ID", async () => {
      const mockConversation = { id: 1, created_at: new Date() };

      ConversationModel.getById.mockResolvedValue(mockConversation);

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ConversationController.getConversationById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockConversation });
    });

    it("should return 404 if conversation not found", async () => {
      ConversationModel.getById.mockResolvedValue(null);

      const req = mockRequest();
      req.params.id = 999;
      const res = mockResponse();

      await ConversationController.getConversationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Conversation not found" }] });
    });

    it("should handle server error", async () => {
      ConversationModel.getById.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ConversationController.getConversationById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("createConversation", () => {
    it("should create a new conversation", async () => {
      const req = mockRequest();
      req.body = {}; // Si une conversation n'a pas de champs spécifiques, envoyez un objet vide
      const res = mockResponse();

      ConversationModel.create.mockResolvedValue({ id: 1, created_at: new Date() });

      await ConversationController.createConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 1, created_at: expect.any(Date) } });
    });

    it("should handle server error", async () => {
      const req = mockRequest();
      req.body = {}; // Si une conversation n'a pas de champs spécifiques, envoyez un objet vide
      const res = mockResponse();

      ConversationModel.create.mockRejectedValue(new Error("Server Error"));

      await ConversationController.createConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });

    it("should return 400 if validation fails", async () => {
      const req = mockRequest();
      req.body = { invalidField: "invalidValue" };
      const res = mockResponse();

      await ConversationController.createConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: expect.any(Array) });
    });
  });

  describe("deleteConversation", () => {
    it("should delete a conversation", async () => {
      ConversationModel.delete.mockResolvedValue({});

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ConversationController.deleteConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 404 if conversation not found", async () => {
      ConversationModel.delete.mockResolvedValue(null);

      const req = mockRequest();
      req.params.id = 999;
      const res = mockResponse();

      await ConversationController.deleteConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Conversation not found" }] });
    });

    it("should handle server error", async () => {
      ConversationModel.delete.mockRejectedValue(new Error("Server Error"));

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ConversationController.deleteConversation(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: "Server Error" }] });
    });
  });
});
