const pool = require("../config/db");

class AddressModel {
  static async getAll() {
    try {
      const addressDataResult = await pool.query("SELECT * FROM Address");
      return addressDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving addresses: ${err.message}`);
    }
  }

  static async getById(addressId) {
    try {
      const addressDataResult = await pool.query(
        "SELECT * FROM Address WHERE AddressId = $1",
        [addressId]
      );
      if (addressDataResult.rows.length === 0) {
        throw new Error("Address not found");
      }
      return addressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving address: ${err.message}`);
    }
  }

  static async create({ city, postal_code, longitude, latitude }) {
    try {
      const newAddressDataResult = await pool.query(
        "INSERT INTO Address (City, Postal_Code, Longitude, Latitude) VALUES ($1, $2, $3, $4) RETURNING *",
        [city, postal_code, longitude, latitude]
      );

      return newAddressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating address: ${err.message}`);
    }
  }

  static async delete(addressId) {
    try {
      const result = await pool.query("DELETE FROM Address WHERE AddressId = $1 RETURNING *", [
        addressId,
      ]);
      if (result.rows.length === 0) {
        throw new Error("Address not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting address: ${err.message}`);
    }
  }

  static async update(addressId, { city, postal_code, longitude, latitude }) {
    try {
      const updatedAddressDataResult = await pool.query(
        "UPDATE Address SET City = $1, Postal_Code = $2, Longitude = $3, Latitude = $4 WHERE AddressId = $5 RETURNING *",
        [city, postal_code, longitude, latitude, addressId]
      );

      if (updatedAddressDataResult.rows.length === 0) {
        throw new Error("Address not found");
      }

      return updatedAddressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating address: ${err.message}`);
    }
  }
}

module.exports = AddressModel;
