const pool = require("../config/db");

class AddressModel {
  /**
   * Methode GetAll
   * Permet de récupérer toutes les adresses
   *
   * Pas utilisé dans le front
   */
  static async getAll() {
    try {
      const addressDataResult = await pool.query("SELECT * FROM Address");
      return addressDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving addresses: ${err.message}`);
    }
  }

  /**
   * Methode GetById
   * Permet de recupérer une adresse par son id
   *
   * Pas utilisé dans le front
   */
  static async getById(addressId) {
    try {
      const addressDataResult = await pool.query(
        "SELECT * FROM Address WHERE id = $1",
        [addressId]
      );
      if (addressDataResult.rows.length === 0) {
        return null;
      }
      return addressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error retrieving address: ${err.message}`);
    }
  }

  /**
   * Mehtode Create
   * Permet d'ajouter une adresse
   *
   * Utilisé dans le front
   */
  static async create({ city, postal_code, longitude, latitude }) {
    try {
      const newAddressDataResult = await pool.query(
        "INSERT INTO Address (City, Postal_code, Longitude, Latitude) VALUES ($1, $2, $3, $4) RETURNING *",
        [city, postal_code, longitude, latitude]
      );
      return newAddressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating address: ${err.message}`);
    }
  }

  /**
   * Methode Delete
   * Permet de supprimer une annonce
   *
   * Utilisé dans le front
   */
  static async delete(addressId) {
    try {
      const result = await pool.query(
        "DELETE FROM Address WHERE id = $1 RETURNING *",
        [addressId]
      );
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting address: ${err.message}`);
    }
  }

  /**
   * Methode Update
   * Permet de mettre à jour l'adresse
   *
   * Utilisé dans le front
   */
  static async update(addressId, { city, postal_code, longitude, latitude }) {
    try {
      const updatedAddressDataResult = await pool.query(
        "UPDATE Address SET City = $1, Postal_code = $2, Longitude = $3, Latitude = $4 WHERE id = $5 RETURNING *",
        [city, postal_code, longitude, latitude, addressId]
      );
      if (updatedAddressDataResult.rows.length === 0) {
        return null;
      }
      return updatedAddressDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating address: ${err.message}`);
    }
  }
}

module.exports = AddressModel;
