const pool = require("../config/db");

class SubCategoryModel {
  /**
   * Methode GetAll
   * Permet de récupérer toutes les sous-catégories
   */
  static async getAll() {
    try {
      const subCategoriesDataResult = await pool.query("SELECT * FROM Sub_category");
      return subCategoriesDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving sub-categories: ${err.message}`);
    }
  }

  /**
   * Methode GetById
   * Permet de récupérer une sous-catégorie par son id
   */
  static async getById(subCategoryId) {
    try {
      const subCategoryDataResult = await pool.query(
        "SELECT * FROM Sub_category WHERE id = $1",
        [subCategoryId]
      );
      if (subCategoryDataResult.rows.length === 0) {
        return null; // Retourne null si aucune sous-catégorie n'est trouvée
      }
      return subCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving sub-category: ${err.message}`);
    }
  }

  /**
   * Methode GetByCategoryId
   * Permet de récupérer les sous-catégories par id de catégorie
   */
  static async getByCategoryId(categoryId) {
    try {
      const subCategoryDataResult = await pool.query(
        "SELECT * FROM Sub_category WHERE id_category = $1",
        [categoryId]
      );
      console.log(subCategoryDataResult);
      return subCategoryDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving sub-categories by category: ${err.message}`);
    }
  }

  /**
   * Methode GetByCategoryIdAndSubCategoryId
   * Permet de récupérer une sous-catégorie par id de catégorie et id de sous-catégorie
   */
  static async getByCategoryIdAndSubCategoryId(categoryId, subCategoryId) {
    try {
      const subCategoryDataResult = await pool.query(
        "SELECT * FROM Sub_category WHERE id_category = $1 AND id = $2",
        [categoryId, subCategoryId]
      );
      if (subCategoryDataResult.rows.length === 0) {
        return null; // Retourne null si aucune sous-catégorie n'est trouvée
      }
      return subCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving sub-category by category and sub-category ID: ${err.message}`);
    }
  }

  /**
   * Methode Create
   * Permet de créer une nouvelle sous-catégorie
   */
  static async create({ name, id_category }) {
    try {
      const newSubCategoryDataResult = await pool.query(
        "INSERT INTO Sub_category (name, id_category) VALUES ($1, $2) RETURNING *",
        [name, id_category]
      );
      return newSubCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating sub-category: ${err.message}`);
    }
  }

  /**
   * Methode Delete
   * Permet de supprimer une sous-catégorie par son id
   */
  static async delete(subCategoryId) {
    try {
      const result = await pool.query(
        "DELETE FROM Sub_category WHERE id = $1 RETURNING *",
        [subCategoryId]
      );
      if (result.rows.length === 0) {
        return null; // Retourne null si aucune sous-catégorie n'est trouvée
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting sub-category: ${err.message}`);
    }
  }

  /**
   * Methode Update
   * Permet de modifier une sous-catégorie
   */
  static async update(subCategoryId, { name, id_category }) {
    try {
      const updateSubCategoryDataResult = await pool.query(
        "UPDATE Sub_category SET name = $1, id_category = $2 WHERE id = $3 RETURNING *",
        [name, id_category, subCategoryId]
      );
      if (updateSubCategoryDataResult.rows.length === 0) {
        return null; // Retourne null si aucune sous-catégorie n'est trouvée
      }
      return updateSubCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating sub-category: ${err.message}`);
    }
  }
}

module.exports = SubCategoryModel;
