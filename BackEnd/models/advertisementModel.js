const pool = require("../config/db");

class AdvertisementModel {
  /**
   * Methode GetAll
   * Permet de récupérer toutes les annonces
   *
   * Pas utilisé dans le front
   */
  static async getAll() {
    try {
      const advertisementsDataResult = await pool.query(
        "SELECT * FROM Advertisement"
      );
      return advertisementsDataResult.rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisements: ${err.message}`);
    }
  }

  /**
   * Methode GetById
   * Permet de récupérer toutes les annonces par id
   *
   * Pas utilisé dans le front
   */
  static async getById(advertisementID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM Advertisement A WHERE A.id = $1",
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

  /**
   * Methode GetByUserId
   * Permet de récupérer toutes les annonces par id user
   *
   * Utilisé dans le front
   */
  static async getByUserId(userID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM Advertisement A WHERE A.id_User = $1",
        [userID]
      );
      if (advertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return advertisementDataResult.rows;
    } catch (err) {
      throw new Error(
        `Error retrieving advertisements for user: ${err.message}`
      );
    }
  }

  /**
   * Methode GetByAddressId
   * Permet de récupérer toutes les annonces par id adresse
   *
   * Pas utilisé dans le front
   */
  static async getByAddressId(addressID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM Advertisement A WHERE A.id_Address = $1",
        [addressID]
      );
      if (advertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return advertisementDataResult.rows;
    } catch (err) {
      throw new Error(
        `Error retrieving advertisements for address: ${err.message}`
      );
    }
  }

  /**
   * Methode Create
   * Permet de créer une annonce
   *
   * Utilisé dans le front
   */
  static async create({ title, start_date, end_date, user_id, address_id }) {
    try {
      const newAdvertisementDataResult = await pool.query(
        "INSERT INTO Advertisement (Title, start_date, End_date, id_User, id_Address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, start_date, end_date, user_id, address_id]
      );

      return newAdvertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error creating advertisement: ${err.message}`);
    }
  }

  /**
   * Methode Delete
   * Permet de supprimer une annonce par son id
   *
   * Utilisé dans le front
   */
  static async delete(advertisementId) {
    try {
      const result = await pool.query(
        "DELETE FROM Advertisement WHERE Advertisement.id = $1 RETURNING *",
        [advertisementId]
      );
      if (result.rows.length === 0) {
        throw new Error("Advertisement not found");
      }
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error deleting advertisement: ${err.message}`);
    }
  }

  /**
   * Methode Update
   * Permet de modifier une annonce par id
   *
   * A FAIRE
   * Pas encore utilisé dans le front
   */
  static async update(
    advertisementId,
    { title, start_date, end_date, user_id, address_id }
  ) {
    try {
      const updatedAdvertisementDataResult = await pool.query(
        "UPDATE Advertisement A SET Title = $1, start_date = $2, end_date = $3, id_User = $4, id_Address = $5 WHERE A.id = $6 RETURNING *",
        [title, start_date, end_date, user_id, address_id, advertisementId]
      );

      if (updatedAdvertisementDataResult.rows.length === 0) {
        throw new Error("Advertisement not found");
      }

      return updatedAdvertisementDataResult.rows[0];
    } catch (err) {
      throw new Error(`Error updating advertisement: ${err.message}`);
    }
  }

  /**
   * Methode GetAdvertisementDetails
   * Permet de récupérer toutes les annonces et d'autres infos
   *
   * Utilisé dans le front
   */
  static async getAdvertisementDetails() {
    try {
      const query = `
      SELECT 
      A.id,
      A.Title AS AdvertisementTitle,
      A.start_date,
      A.end_date,
      A.creation_date,
      Ad.City,
      Ad.Postal_code,
      Sc.name AS SubCategoryName,
      C.name AS CategoryName,
      I.image AS FirstImage
    FROM 
      Advertisement A
    INNER JOIN 
      Address Ad ON A.id_Address = Ad.id
    INNER JOIN 
      Plant P ON A.id = P.id_Advertisement
    INNER JOIN 
      Sub_category Sc ON P.id_Sub_category = Sc.id
    INNER JOIN 
      Category C ON Sc.id_category = C.id
    LEFT JOIN
      (SELECT DISTINCT ON (id_Plant) image, id_Plant FROM Image I ORDER BY id_Plant, id) AS Image
    ON P.id = I.id_Plant;    
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisement details: ${err.message}`);
    }
  }

  /**
   * Methode GetAdvertisementDetailsByID
   * Permet de récupérer une annonce et d'autres infos par son id
   *
   * Utilisé dans le front
   */
  static async getAdvertisementDetailsById(advertisementID) {
    try {
      const advertisementDataResult = await pool.query(
        `
      SELECT a.Title AS AdvertisementTitle, a.start_date, a.end_date, a.creation_date, u.first_name, u.last_name, u.email, ad.City, ad.Postal_Code, ad.Longitude, ad.Latitude 
      FROM Advertisement a 
      JOIN Users u ON a.id_User = u.id 
      JOIN Address ad ON a.id_Address = ad.id 
      WHERE a.id = $1;`,
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
}

module.exports = AdvertisementModel;
