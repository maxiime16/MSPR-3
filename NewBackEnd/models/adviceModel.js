const pool = require("../config/db");

class AdviceModel {
  static async getAll() {
    try {
      const advicesDataResult = await pool.query("SELECT * FROM advice");
      return advicesDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advices: ${err.message}`);
    }
  }

  static async getById(adviceID) {
    try {
      const adviceDataResult = await pool.query("SELECT * FROM advice WHERE id = $1", [adviceID]);
      if (adviceDataResult.rows.length === 0) {
        throw new Error("Advice not found");
      }
      return adviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving advice: ${err.message}`);
    }
  }

  static async create({ advice, advertisement_id, user_id }) {
    try {
      const newAdviceDataResult = await pool.query(
        "INSERT INTO advice (advice, advertisement_id, user_id) VALUES ($1, $2, $3) RETURNING *",
        [advice, advertisement_id, user_id]
      );
      return newAdviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating advice: ${err.message}`);
    }
  }

  static async delete(adviceId) {
    try {
      const result = await pool.query("DELETE FROM advice WHERE id = $1 RETURNING *", [adviceId]);
      if (result.rows.length === 0) {
        throw new Error("Advice not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting advice: ${err.message}`);
    }
  }

  static async update(adviceId, { advice, advertisement_id, user_id }) {
    try {
      const updateAdviceDataResult = await pool.query(
        "UPDATE advice SET advice = $1, advertisement_id = $2, user_id = $3 WHERE id = $4 RETURNING *",
        [advice, advertisement_id, user_id, adviceId]
      );

      if (updateAdviceDataResult.rows.length === 0) {
        throw new Error("Advice not found");
      }

      return updateAdviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating advice: ${err.message}`);
    }
  }
}

module.exports = AdviceModel;
