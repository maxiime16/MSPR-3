const pool = require("../config/db");

class AdvertisementModel {
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

  static async getById(advertisementID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM Advertisement WHERE Advertisement.id = $1",
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
        "SELECT * FROM Advertisement WHERE Advertisement.id_User = $1",
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

  static async getByAddressId(addressID) {
    try {
      const advertisementDataResult = await pool.query(
        "SELECT * FROM Advertisement WHERE Advertisement.id_Address = $1",
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

  // a modifier
  static async update(
    advertisementId,
    { title, start_date, end_date, user_id, address_id }
  ) {
    try {
      const updatedAdvertisementDataResult = await pool.query(
        "UPDATE Advertisement SET Title = $1, StartDate = $2, EndDate = $3, UserId = $4, AddressId = $5 WHERE AdvertisementId = $6 RETURNING *",
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

  static async getAdvertisementDetails() {
    try {
      const query = `
      SELECT 
      Advertisement.id,
      Advertisement.Title AS AdvertisementTitle,
      Advertisement.start_date,
      Advertisement.end_date,
      Advertisement.creation_date,
      Address.City,
      Address.Postal_code,
      Sub_category.name AS SubCategoryName,
      category.name AS CategoryName,
      Image.image AS FirstImage
    FROM 
      Advertisement
    INNER JOIN 
      Address ON Advertisement.id_Address = Address.id
    INNER JOIN 
      Plant ON Advertisement.id = Plant.id_Advertisement
    INNER JOIN 
      Sub_category ON Plant.id_Sub_category = Sub_category.id
    INNER JOIN 
      category ON Sub_category.id_category = category.id
    LEFT JOIN
      (SELECT DISTINCT ON (id_Plant) image, id_Plant FROM Image ORDER BY id_Plant, id) AS Image
    ON Plant.id = Image.id_Plant;    
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (err) {
      throw new Error(`Error retrieving advertisement details: ${err.message}`);
    }
  }

  static async getAdvertisementDetailsById(advertisementID) {
    try {
      const advertisementDataResult = await pool.query(`
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
