// messageModel.js
const pool = require("../config/db");

class MessageModel {
  static async getAll() {
    try {
      const messageDataResult = await pool.query("SELECT * FROM Message");
      return messageDataResult.rows;
    } catch (err) {
      throw new Error(`"Error retrieving messages: ${err.message}`);
    }
  }

  static async getById(messageId) {
    try {
      const messageDataResult = await pool.query(
        "SELECT * FROM Message WHERE id = $1",
        [messageId]
      );
      if (messageDataResult.rows.length === 0) {
        return null;
      }
      return messageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }

  static async getByIdUser(userId) {
    try {
      const messageDataResult = await pool.query(
        "SELECT * FROM Message WHERE id_User = $1",
        [userId]
      );
      if (messageDataResult.rows.length === 0) {
        return null;
      }
      return messageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }

  static async getByIdUserRecep(userRecepId) {
    try {
      const messageDataResult = await pool.query(
        "SELECT * FROM Message WHERE id_User_Recepteur = $1",
        [userRecepId]
      );
      if (messageDataResult.rows.length === 0) {
        return null;
      }
      return messageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }

  static async getByIdConversation(conversationId) {
    try {
      const messageDataResult = await pool.query(
        "SELECT * FROM Message WHERE id_Conversation = $1",
        [conversationId]
      );
      if (messageDataResult.rows.length === 0) {
        return null;
      }
      return messageDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }

  static async create({
    message,
    id_User,
    id_User_Recepteur,
    id_Conversation,
  }) {
    try {
      const newMessageDataResult = await pool.query(
        "INSERT INTO Message (message, id_User, id_User_Recepteur, id_Conversation) VALUES ($1, $2, $3, $4) RETURNING *",
        [message, id_User, id_User_Recepteur, id_Conversation]
      );
    } catch (err) {
      throw new Error(`Error retrieving message: ${err.message}`);
    }
  }
}
