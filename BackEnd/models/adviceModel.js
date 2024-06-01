const pool = require("../config/db");

class AdviceModel {
  static async getAll() {
    try {
      const adviceDataResult = await pool.query("SELECT * FROM Advice");
      return adviceDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advice: ${err.message}`);
    }
  }

  static async getById(adviceId) {
    try {
      const adviceDataResult = await pool.query(
        "SELECT * FROM Advice A WHERE A.id = $1",
        [adviceId]
      );
      if (adviceDataResult.rows.length === 0) {
        throw new Error("Advice not found");
      }
      return adviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving advice: ${err.message}`);
    }
  }

  static async getByPlantId(plantId) {
    try {
      const adviceDataResult = await pool.query(
        `SELECT 
          A.id,
          A.Content,
          A.Creation_date,
          U.first_name,
          U.last_name
        FROM 
          Advice A
        JOIN 
          Users U ON A.id_User = U.id
        WHERE 
          A.id_Plant = $1`,
        [plantId]
      );
      return adviceDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advice by plant ID: ${err.message}`);
    }
  }

  static async create({ content, user_id, id_plant }) {
    try {
      const newAdviceDataResult = await pool.query(
        "INSERT INTO Advice (Content, id_User, id_Plant) VALUES ($1, $2, $3) RETURNING *",
        [content, user_id, id_plant]
      );

      return newAdviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating advice: ${err.message}`);
    }
  }

  static async delete(adviceId) {
    try {
      const result = await pool.query("DELETE FROM Advice A WHERE A.id = $1 RETURNING *", [
        adviceId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Advice not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting advice: ${err.message}`);
    }
  }

  static async update(adviceId, { content, user_id, id_plant }) {
    try {
      const updatedAdviceDataResult = await pool.query(
        "UPDATE Advice SET Content = $1, id_User = $2, id_Plant = $3 WHERE id = $4 RETURNING *",
        [content, user_id, id_plant, adviceId]
      );

      if (updatedAdviceDataResult.rows.length === 0) {
        throw new Error("Advice not found");
      }

      return updatedAdviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating advice: ${err.message}`);
    }
  }
}

module.exports = AdviceModel;
