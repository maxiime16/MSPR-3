const pool = require("../config/db");

class ImageModel {
  /**
   * Methode GetAll
   * Permet de récupérer toutes les images
   *
   * Pas utilisé dans le front
   */
  static async getAll() {
    try {
      const imagesDataResult = await pool.query("SELECT * FROM Image");
      return imagesDataResult.rows;
    } catch (err) {
      console.error(`Error retrieving images: ${err.message}`);
      throw new Error(`Error retrieving images: ${err.message}`);
    }
  }

  /**
   * Methode GetById
   * Permet de récupérer une image par son id
   *
   * Pas utilisé dans le front
   */
  static async getById(imageId) {
    try {
      const imageDataResult = await pool.query(
        "SELECT * FROM Image I WHERE I.id = $1",
        [imageId]
      );
      if (imageDataResult.rows.length === 0) {
        return null; // Retourne null si aucune image n'est trouvée
      }
      return imageDataResult.rows[0];
    } catch (err) {
      console.error(`Error retrieving image: ${err.message}`);
      throw new Error(`Error retrieving image: ${err.message}`);
    }
  }

  /**
   * Methode GetByPlantId
   * Permet de récupérer les images par son id plant
   *
   * Pas utilisé dans le front
   */
  static async getByPlantId(plantId) {
    try {
      const imagesDataResult = await pool.query(
        "SELECT I.id, I.Image FROM Image I WHERE I.id_Plant = $1",
        [plantId]
      );
      return imagesDataResult.rows;
    } catch (err) {
      console.error(`Error retrieving images: ${err.message}`);
      throw new Error(`Error retrieving images: ${err.message}`);
    }
  }

  /**
   * Methode Create
   * Permet de créer une image
   *
   * Utilisé dans le front
   */
  static async create({ image, id_Plant }) {
    try {
      const imageBuffer = Buffer.from(image, "base64"); // Convertir base64 en Buffer
      const result = await pool.query(
        "INSERT INTO Image (Image, id_Plant) VALUES ($1, $2) RETURNING *",
        [imageBuffer, id_Plant]
      );
      return result.rows[0];
    } catch (err) {
      console.error(`Error creating image: ${err.message}`);
      throw new Error(`Error creating image: ${err.message}`);
    }
  }

  /**
   * Methode Delete
   * Permet de supprimer une image
   *
   * Utilisé dans le front
   */
  static async delete(imageId) {
    try {
      const result = await pool.query(
        "DELETE FROM Image I WHERE I.id = $1 RETURNING I.id",
        [imageId]
      );
      if (result.rows.length === 0) {
        return null; // Retourne null si aucune image n'est trouvée
      }
      return result.rows[0];
    } catch (err) {
      console.error(`Error deleting image: ${err.message}`);
      throw new Error(`Error deleting image: ${err.message}`);
    }
  }
}

module.exports = ImageModel;
