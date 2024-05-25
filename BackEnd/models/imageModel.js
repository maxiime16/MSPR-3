const pool = require("../config/db");

class ImageModel {
  static async getAll() {
    try {
      const imagesDataResult = await pool.query("SELECT * FROM Image");
      return imagesDataResult.rows;
    } catch (err) {
      console.error(`Error retrieving images: ${err.message}`);
      throw new Error(`Error retrieving images: ${err.message}`);
    }
  }

  static async getById(imageId) {
    try {
      const imageDataResult = await pool.query("SELECT * FROM Image WHERE ImageId = $1", [imageId]);
      return imageDataResult.rows[0];
    } catch (err) {
      console.error(`Error retrieving image: ${err.message}`);
      throw new Error(`Error retrieving image: ${err.message}`);
    }
  }

  static async getByPlantId(plantId) {
    try {
      const imagesDataResult = await pool.query("SELECT Image.Image FROM Image WHERE PlantId = $1", [plantId]);
      return imagesDataResult.rows;
    } catch (err) {
      console.error(`Error retrieving images: ${err.message}`);
      throw new Error(`Error retrieving images: ${err.message}`);
    }
  }

  static async create({ image, plant_id }) {
    try {
      const imageBuffer = Buffer.from(image, 'base64'); // Convertir base64 en Buffer
      const result = await pool.query(
        "INSERT INTO Image (Image, PlantId) VALUES ($1, $2) RETURNING *",
        [imageBuffer, plant_id]
      );
      return result.rows[0];
    } catch (err) {
      console.error(`Error creating image: ${err.message}`);
      throw new Error(`Error creating image: ${err.message}`);
    }
  }

  static async delete(imageId) {
    try {
      const result = await pool.query("DELETE FROM Image WHERE ImageId = $1 RETURNING ImageId", [imageId]);
      return result.rows[0];
    } catch (err) {
      console.error(`Error deleting image: ${err.message}`);
      throw new Error(`Error deleting image: ${err.message}`);
    }
  }

}

module.exports = ImageModel;
