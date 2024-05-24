const pool = require("../config/db");

class CategoryModel {
  static async getAll() {
    try {
      const categoryDataResult = await pool.query("SELECT * FROM Category");
      return categoryDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving categories: ${err.message}`);
    }
  }

  static async getById(categoryId) {
    try {
      const categoryDataResult = await pool.query(
        "SELECT * FROM Category WHERE CategoryId = $1",
        [categoryId]
      );
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
        "INSERT INTO Category (Name) VALUES ($1) RETURNING *",
        [name]
      );

      return newCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating category: ${err.message}`);
    }
  }

  static async delete(categoryId) {
    try {
      const result = await pool.query("DELETE FROM Category WHERE CategoryId = $1 RETURNING *", [
        categoryId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Category not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting category: ${err.message}`);
    }
  }

  static async update(categoryId, { name }) {
    try {
      const updatedCategoryDataResult = await pool.query(
        "UPDATE Category SET Name = $1 WHERE CategoryId = $2 RETURNING *",
        [name, categoryId]
      );

      if (updatedCategoryDataResult.rows.length === 0) {
        throw new Error("Category not found");
      }

      return updatedCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating category: ${err.message}`);
    }
  }
}

module.exports = CategoryModel;
