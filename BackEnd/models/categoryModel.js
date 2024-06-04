const pool = require("../config/db");

class CategoryModel {
  /**
   * Methode GetAll
   * Permet de récupérer toutes les catégories
   *
   * Utilisé dans le front
   */
  static async getAll() {
    try {
      const categoryDataResult = await pool.query("SELECT * FROM Category");
      return categoryDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving categories: ${err.message}`);
    }
  }

  /**
   * Methode GetById
   * Permet de récupérer une catégorie par son id
   *
   * Pas utilisé dans le front
   */
  static async getById(categoryId) {
    try {
      const categoryDataResult = await pool.query(
        "SELECT * FROM Category WHERE Category.id = $1",
        [categoryId]
      );
      if (categoryDataResult.rows.length === 0) {
        return null; // Retourne null si aucune catégorie n'est trouvée
      }
      return categoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving category: ${err.message}`);
    }
  }

  static async create({ name }) {
    try {
      const newCategoryDataResult = await pool.query(
        "INSERT INTO Category (Name) VALUES ($1) RETURNING *",
        [name]
      );

      return newCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating category: ${err.message}`);
    }
  }

  /**
   * Methode Delete
   * Permet de supprimer une catégorie par son id
   *
   * Pas utilisé dans le front
   */
  static async delete(categoryId) {
    try {
      const result = await pool.query(
        "DELETE FROM Category C WHERE C.id = $1 RETURNING *",
        [categoryId]
      );
      if (result.rows.length === 0) {
        return null; // Retourne null si aucune catégorie n'est trouvée
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting category: ${err.message}`);
    }
  }

  /**
   * Methode Update
   * Permet de modifier une catégorie
   *
   * Pas utilisé dans le front
   */
  static async update(categoryId, { name }) {
    try {
      const updatedCategoryDataResult = await pool.query(
        "UPDATE Category C SET C.Name = $1 WHERE C.id = $2 RETURNING *",
        [name, categoryId]
      );

      if (updatedCategoryDataResult.rows.length === 0) {
        return null; // Retourne null si aucune catégorie n'est trouvée
      }

      return updatedCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating category: ${err.message}`);
    }
  }
}

module.exports = CategoryModel;
