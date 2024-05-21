const pool = require("../config/db");

class AdvertisementModel {
  static async getAll() {
    try {
      const advertisementsDataResult = await pool.query("SELECT * FROM advertisements");
      return advertisementsDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisements: ${err.message}`);
    }
  }

  static async getById(advertisementID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM advertisements WHERE id = $1",
        [advertisementID]
      );
      if (advertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return advertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving advertisement: ${err.message}`);
    }
  }

  static async getByUserId(userID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM advertisements WHERE user_id = $1",
        [userID]
      );
      if (advertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return advertisementDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisements for user: ${err.message}`);
    }
  }

  static async getByCategoryId(categoryID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM advertisements WHERE category_id = $1",
        [categoryID]
      );
      if (advertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return advertisementDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisements for category: ${err.message}`);
    }
  }

  static async create({
    title,
    description,
    longitude,
    latitude,
    start_date,
    end_date,
    city,
    postal_code,
    user_id,
    category_id,
    sub_category_id,
  }) {
    try {
      const newAdvertisementDataResult = await pool.query(
        "INSERT INTO advertisements (title, description, longitude, latitude, start_date, end_date, city, postal_code, user_id, category_id, sub_category_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
        [
          title,
          description,
          longitude,
          latitude,
          start_date,
          end_date,
          city,
          postal_code,
          user_id,
          category_id,
          sub_category_id,
        ]
      );

      return newAdvertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating advertisement: ${err.message}`);
    }
  }

  static async delete(advertisementId) {
    try {
      const result = await pool.query("DELETE FROM advertisements WHERE id = $1 RETURNING *", [
        advertisementId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting advertisement: ${err.message}`);
    }
  }

  static async update(
    advertisementId,
    {
      title,
      description,
      longitude,
      latitude,
      start_date,
      end_date,
      city,
      postal_code,
      user_id,
      category_id,
      sub_category_id,
    }
  ) {
    try {
      const updatedAdvertisementDataResult = await pool.query(
        "UPDATE advertisements SET title = $1, description = $2, longitude = $3, latitude = $4, start_date = $5, end_date = $6, city = $7, postal_code = $8, user_id = $9, category_id = $10, sub_category_id = $11 WHERE id = $12 RETURNING *",
        [
          title,
          description,
          longitude,
          latitude,
          start_date,
          end_date,
          city,
          postal_code,
          user_id,
          category_id,
          sub_category_id,
          advertisementId,
        ]
      );

      if (updatedAdvertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }

      return updatedAdvertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating advertisement: ${err.message}`);
    }
  }
}

module.exports = AdvertisementModel;
