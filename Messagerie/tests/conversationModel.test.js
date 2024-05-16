const pool = require("../config/db");
const ConversationModel = require("../models/conversationModel");

jest.mock("../config/db");

describe("ConversationModel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all conversations", async () => {
      const mockConversations = [{ id: 1 }, { id: 2 }];
      pool.query.mockResolvedValue({ rows: mockConversations });

      const result = await ConversationModel.getAll();
      expect(result).toEqual(mockConversations);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM conversations");
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(ConversationModel.getAll()).rejects.toThrow(
        "Error retrieving conversations: Database error"
      );
    });
  });

  describe("getById", () => {
    it("should return a conversation by ID", async () => {
      const mockConversation = { id: 1 };
      pool.query.mockResolvedValue({ rows: [mockConversation] });

      const result = await ConversationModel.getById(1);
      expect(result).toEqual(mockConversation);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM conversations WHERE id = $1",
        [1]
      );
    });

    it("should throw an error if conversation is not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(ConversationModel.getById(1)).rejects.toThrow(
        "Conversation not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(ConversationModel.getById(1)).rejects.toThrow(
        "Error retrieving conversation: Database error"
      );
    });
  });

  describe("create", () => {
    it("should create a new conversation", async () => {
      const mockConversation = { id: 1, created_at: new Date() };
      pool.query.mockResolvedValue({ rows: [mockConversation] });

      const result = await ConversationModel.create();
      expect(result).toEqual(mockConversation);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO conversations DEFAULT VALUES RETURNING *"
      );
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(ConversationModel.create()).rejects.toThrow(
        "Error creating conversation: Database error"
      );
    });
  });

  describe("delete", () => {
    it("should delete a conversation", async () => {
      const mockConversation = { id: 1 };
      pool.query.mockResolvedValue({ rows: [mockConversation] });

      const result = await ConversationModel.delete(1);
      expect(result).toEqual(mockConversation);
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM conversations WHERE id = $1 RETURNING *",
        [1]
      );
    });

    it("should throw an error if conversation is not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(ConversationModel.delete(1)).rejects.toThrow(
        "Conversation not found"
      );
    });

    it("should throw an error if database query fails", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      await expect(ConversationModel.delete(1)).rejects.toThrow(
        "Error deleting conversation: Database error"
      );
    });
  });
});
