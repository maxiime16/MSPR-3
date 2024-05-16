const pool = require("../config/db");

class MessageModel {
  static async getAll() {
    try {
      const messageDataResult = await pool.query("SELECT * FROM messages");
      return messageDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving messages: ${err.message}`);
    }
  }

  static async getByConversationId(conversationID) {
    try {
      const messageDataResult = await pool.query("SELECT * FROM messages WHERE conversation_id = $1", [conversationID]);
      return messageDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving messages by conversation ID: ${err.message}`);
    }
  }

  static async getById(messageID) {
    try {
      const messageDataResult = await pool.query("SELECT * FROM messages WHERE id = $1", [messageID]);
      if (messageDataResult.rows.length === 0) {
        throw new Error("Message not found");
      }
      return messageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }

  static async create({ conversation_id, sender_id, content }) {
    try {
      const newMessageDataResult = await pool.query(
        "INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
        [conversation_id, sender_id, content]
      );
      return newMessageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating message: ${err.message}`);
    }
  }

  static async delete(messageID) {
    try {
      const result = await pool.query("DELETE FROM messages WHERE id = $1 RETURNING *", [messageID]);
      if (result.rows.length === 0) {
        throw new Error("Message not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting message: ${err.message}`);
    }
  }
}

module.exports = MessageModel;
