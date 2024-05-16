const pool = require("../config/db");

class ConversationModel {
  static async getAll() {
    try {
      const conversationDataResult = await pool.query(
        "SELECT * FROM conversations"
      );
      return conversationDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving conversations: ${err.message}`);
    }
  }

  static async getById(conversationID) {
    try {
      const conversationDataResult = await pool.query(
        "SELECT * FROM conversations WHERE id = $1",
        [conversationID]
      );
      if (conversationDataResult.rows.length === 0) {
        throw new Error("Conversation not found");
      }
      return conversationDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving conversation: ${err.message}`);
    }
  }

  static async create() {
    try {
      const newConversationDataResult = await pool.query(
        "INSERT INTO conversations DEFAULT VALUES RETURNING *"
      );
      return newConversationDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating conversation: ${err.message}`);
    }
  }

  static async delete(conversationID) {
    try {
      const result = await pool.query(
        "DELETE FROM conversations WHERE id = $1 RETURNING *",
        [conversationID]
      );
      if (result.rows.length === 0) {
        throw new Error("Conversation not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting conversation: ${err.message}`);
    }
  }
}

module.exports = ConversationModel;
