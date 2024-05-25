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
        "SELECT * FROM Advertisement WHERE AdvertisementId = $1",
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
        "SELECT * FROM Advertisement WHERE UserId = $1",
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
        "SELECT * FROM Advertisement WHERE AddressId = $1",
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
        "INSERT INTO Advertisement (Title, StartDate, EndDate, UserId, AddressId) VALUES ($1, $2, $3, $4, $5) RETURNING *",
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
        "DELETE FROM Advertisement WHERE AdvertisementId = $1 RETURNING *",
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
      Advertisement.AdvertisementId,
      Advertisement.Title AS AdvertisementTitle,
      Advertisement.StartDate,
      Advertisement.EndDate,
      Address.City,
      Address.Postal_Code,
      SubCategory.Name AS SubCategoryName,
      Category.Name AS CategoryName,
      Image.Image AS FirstImage
    FROM 
      Advertisement
    INNER JOIN 
      Address ON Advertisement.AddressId = Address.AddressId
    INNER JOIN 
      Plant ON Advertisement.AdvertisementId = Plant.AdvertisementId
    INNER JOIN 
      SubCategory ON Plant.SubCategoryId = SubCategory.SubCategoryId
    INNER JOIN 
      Category ON SubCategory.CategoryId = Category.CategoryId
    LEFT JOIN
      (SELECT DISTINCT ON (PlantId) Image.Image, PlantId FROM Image ORDER BY PlantId, ImageId) AS Image
      ON Plant.PlantId = Image.PlantId;
    
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
      SELECT a.Title AS AdvertisementTitle, a.StartDate, a.EndDate, u.FirstName, u.LastName, u.Email, ad.City, ad.Postal_Code, ad.Longitude, ad.Latitude 
      FROM Advertisement a 
      JOIN Users u ON a.UserId = u.UserId 
      JOIN Address ad ON a.AddressId = ad.AddressId 
      WHERE a.AdvertisementId = $1;`,
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
