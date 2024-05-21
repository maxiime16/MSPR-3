const pool = require("../config/db");

class CategoryModel {
  static async getAll() {
    try {
      const categoryDataResult = await pool.query("SELECT * FROM category");
      return categoryDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving categories: ${err.message}`);
    }
  }

  static async getById(categoryID) {
    try {
      const categoryDataResult = await pool.query("SELECT * FROM category WHERE id = $1", [categoryID]);
      if (categoryDataResult.rows.length === 0) {
        throw new Error("Category not found");
      }
      return categoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving category: ${err.message}`);
    }
  }

  static async create({ name }) {
    try {
      const newCategoryDataResult = await pool.query(
        "INSERT INTO category (name) VALUES ($1) RETURNING *",
        [name]
      );
      return newCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating category: ${err.message}`);
    }
  }

  static async delete(categoryID) {
    try {
      const result = await pool.query("DELETE FROM category WHERE id = $1 RETURNING *", [categoryID]);
      if (result.rows.length === 0) {
        throw new Error("Category not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting category: ${err.message}`);
    }
  }

  static async update(categoryID, { name }) {
    try {
      const updateCategoryDataResult = await pool.query(
        "UPDATE category SET name = $1 WHERE id = $2 RETURNING *",
        [name, categoryID]
      );

      if (updateCategoryDataResult.rows.length === 0) {
        throw new Error("Category not found");
      }

      return updateCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating category: ${err.message}`);
    }
  }
}

module.exports = CategoryModel;
