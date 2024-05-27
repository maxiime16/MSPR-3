const pool = require("../config/db");

class PlantModel {
  static async getAll() {
    try {
      const plantDataResult = await pool.query("SELECT * FROM Plant");
      return plantDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving plants: ${err.message}`);
    }
  }

  static async getById(plantId) {
    try {
      const plantDataResult = await pool.query(
        "SELECT * FROM Plant WHERE PlantId = $1",
        [plantId]
      );
      if (plantDataResult.rows.length === 0) {
        throw new Error("Plant not found");
      }
      return plantDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving plant: ${err.message}`);
    }
  }

  static async create({ name_plant, description, advertisement_id, subcategory_id }) {
    try {
      const newPlantDataResult = await pool.query(
        "INSERT INTO Plant (Name_Plant, Description, AdvertisementId, SubCategoryId) VALUES ($1, $2, $3, $4) RETURNING *",
        [name_plant, description, advertisement_id, subcategory_id]
      );

      return newPlantDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating plant: ${err.message}`);
    }
  }

  static async delete(plantId) {
    try {
      const result = await pool.query("DELETE FROM Plant WHERE PlantId = $1 RETURNING *", [
        plantId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Plant not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting plant: ${err.message}`);
    }
  }

  static async update(plantId, { name_plant, description, advertisement_id, subcategory_id }) {
    try {
      const updatedPlantDataResult = await pool.query(
        "UPDATE Plant SET Name_Plant = $1, Description = $2, AdvertisementId = $3, SubCategoryId = $4 WHERE PlantId = $5 RETURNING *",
        [name_plant, description, advertisement_id, subcategory_id, plantId]
      );

      if (updatedPlantDataResult.rows.length === 0) {
        throw new Error("Plant not found");
      }

      return updatedPlantDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating plant: ${err.message}`);
    }
  }

  static async getPlantsByAdvertisementId(advertisementId) {
    try {
      const plantDataResult = await pool.query(
        `
      SELECT 
        p.PlantId
      FROM 
        Plant p
      WHERE 
        p.AdvertisementId = $1;
    `,
        [advertisementId]
      );
      if (plantDataResult.rows.length === 0) {
        throw new Error("Plant not found");
      }
      return plantDataResult.rows; // Retourne toutes les lignes trouvées
    } catch (err) {
      throw new Error(`Error retrieving plant: ${err.message}`);
    }
  }
}

module.exports = PlantModel;
