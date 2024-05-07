const pool = require("../config/db");

class AdvertisementModel {
  static async getAll() {
    try {
      const advertisementsDataResult = await pool.query(
        "SELECT * FROM advertisements"
      );
      return advertisementsDataResult.rows;
    } catch (err) {
      throw new Error(err.message);
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
      throw new Error(err.message);
    }
  }

  static async getByIdUser(userID) {
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
      throw new Error(err.message);
    }
  }

  static async getByIdCategory(categoryID) {
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
      throw new Error(err.message);
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
      throw new Error(err.message);
    }
  }

  static async delete(advertisementId) {
    try {
      await pool.query("DELETE FROM advertisements WHERE id = $1", [
        advertisementId,
      ]);
    } catch (err) {
      throw new Error(err.message);
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

      return updatedAdvertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = AdvertisementModel;
