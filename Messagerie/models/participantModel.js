const pool = require("../config/db");

class ParticipantModel {
  static async getAll() {
    try {
      const participantDataResult = await pool.query(
        "SELECT * FROM participants"
      );
      return participantDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving participants: ${err.message}`);
    }
  }

  static async getByConversationId(conversationID) {
    try {
      const participantDataResult = await pool.query(
        "SELECT * FROM participants WHERE conversation_id = $1",
        [conversationID]
      );
      return participantDataResult.rows;
    } catch (err) {
      throw new Error(
        `Error retrieving participants by conversation ID: ${err.message}`
      );
    }
  }

  static async getByUserId(userID) {
    try {
      const participantDataResult = await pool.query(
        "SELECT * FROM participants WHERE user_id = $1",
        [userID]
      );
      return participantDataResult.rows;
    } catch (err) {
      throw new Error(
        `Error retrieving participants by user ID: ${err.message}`
      );
    }
  }

  static async create({ user_id, conversation_id }) {
    try {
      const newParticipantDataResult = await pool.query(
        "INSERT INTO participants (user_id, conversation_id) VALUES ($1, $2) RETURNING *",
        [user_id, conversation_id]
      );
      return newParticipantDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating participant: ${err.message}`);
    }
  }

  static async delete(participantID) {
    try {
      const result = await pool.query(
        "DELETE FROM participants WHERE id = $1 RETURNING *",
        [participantID]
      );
      if (result.rows.length === 0) {
        throw new Error("Participant not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting participant: ${err.message}`);
    }
  }
}

module.exports = ParticipantModel;
