const pool = require("../config/db");

class SubCategoryModel {
  static async getAll() {
    try {
      const subCategoriesDataResult = await pool.query('SELECT * FROM Sub_category ');
      return subCategoriesDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving sub-categories: ${err.message}`);
    }
  }

  static async getById(subCategoryID) {
    try {
      const subCategoryDataResult = await pool.query('SELECT * FROM Sub_category WHERE Sub_category.id = $1', [subCategoryID]);
      if (subCategoryDataResult.rows.length === 0) {
        throw new Error( "Sub-category not found" );
      }
      return subCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving sub-category: ${err.message}`);
    }
  }

  static async getByCategoryId(categoryID) {
    try {
      const subCategoryDataResult = await pool.query('SELECT * FROM Sub_category WHERE Sub_category.id_category = $1', [categoryID]);
      return subCategoryDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving sub-categories by category: ${err.message}`);
    }
  }

  static async getByCategoryIdAndSubCategoryId(categoryID, subCategoryID) {
    try {
      const subCategoryDataResult = await pool.query(
        'SELECT * FROM Sub_category WHERE Sub_category.id_category = $1 AND Sub_category.id = $2',
        [categoryID, subCategoryID]
      );
      if (subCategoryDataResult.rows.length === 0) {
        throw new Error( "Sub-category not found in the given category ");
      }
      return subCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving sub-category by category and sub-category ID: ${err.message}`);
    }
  }

  static async create({ name, category_id }) {
    try {
      const newSubCategoryDataResult = await pool.query(
        'INSERT INTO Sub_category (Name, CategoryId) VALUES ($1, $2) RETURNING *',
        [name, category_id]
      );
      return newSubCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating sub-category: ${err.message}`);
    }
  }

  static async delete(subCategoryID) {
    try {
      const result = await pool.query('DELETE FROM Sub_category WHERE SubCategoryId = $1 RETURNING *', [subCategoryID]);
      if (result.rows.length === 0) {
        throw new Error( "Sub-category not found" );
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting sub-category: ${err.message}`);
    }
  }

  static async update(subCategoryID, { name, category_id }) {
    try {
      const updateSubCategoryDataResult = await pool.query(
        'UPDATE Sub_category SET Sub_category.name = $1, Sub_category.id_category = $2 WHERE Sub_category.id = $3 RETURNING *',
        [name, category_id, subCategoryID]
      );

      if (updateSubCategoryDataResult.rows.length === 0) {
        throw new Error( "Sub-category not found");
      }

      return updateSubCategoryDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating sub-category: ${err.message}`);
    }
  }
}

module.exports = SubCategoryModel;
