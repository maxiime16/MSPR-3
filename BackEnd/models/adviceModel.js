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
        "SELECT * FROM Advice WHERE AdviceId = $1",
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
          Advice.Content,
          Advice.CreationDate,
          Users.FirstName,
          Users.LastName
        FROM 
          Advice
        JOIN 
          Users ON Advice.UserId = Users.UserId
        WHERE 
          Advice.PlantId = $1`,
        [plantId]
      );
      return adviceDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advice by plant ID: ${err.message}`);
    }
  }

  static async create({ content, user_id, plant_id }) {
    try {
      const newAdviceDataResult = await pool.query(
        "INSERT INTO Advice (Content, UserId, PlantId) VALUES ($1, $2, $3) RETURNING *",
        [content, user_id, plant_id]
      );

      return newAdviceDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating advice: ${err.message}`);
    }
  }

  static async delete(adviceId) {
    try {
      const result = await pool.query("DELETE FROM Advice WHERE AdviceId = $1 RETURNING *", [
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

  static async update(adviceId, { content, user_id, plant_id }) {
    try {
      const updatedAdviceDataResult = await pool.query(
        "UPDATE Advice SET Content = $1, UserId = $2, PlantId = $3 WHERE AdviceId = $4 RETURNING *",
        [content, user_id, plant_id, adviceId]
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
