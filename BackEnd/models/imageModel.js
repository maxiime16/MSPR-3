const pool = require("../config/db");

class ImageModel {

//MÉTHODE DE RÉCUPÉRATION DE TOUTE LES IMAGES
  static async getAll() {
    try {
      const imageDataResult = await pool.query("SELECT * FROM images");
      return imageDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving images: ${err.message}`);
    }
  }

//METHODE DE RÉCUPÉRATION PAR ID
  static async getImageById(imageId) {
    try {
      const imageDataResultGetById = await pool.query(
        "SELECT * FROM images WHERE id = $1",
        [imageId]
      );
      if (imageDataResultGetById.rows.length === 0) {
        return null
      }
      return imageDataResultGetById.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving image: ${err.message}`);
    }
  }

//MÉTHODE DE CREATION IMAGES
  static async CreateImage({
    id,
    image
  }) {
    try {
        const newImageDataResult = await pool.query(
            'INSERT INTO image (id, image)',[
                id,
                image
            ]
        );
        return newImageDataResult.rows[0];
    } catch (err){
        throw new Error (`Error cerating images: ${err.message}`);
    }
  }
  //MÉTHODE DE SUPPRESSION
  static async DeleteImage(imageId){
    try {
        const result = await pool.query(`DELETE FROM images WHERE id = $1 RETURNING *`,[imageId]);
        if (result.rows.length === 0)
            throw new Error ("Images not founds");
            return null;
    } catch (err ){
        throw new Error(`Error deleting Images ${err.message}`);
    }
  }
}
module.exports = ImageModel;
