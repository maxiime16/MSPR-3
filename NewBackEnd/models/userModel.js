const pool = require("../config/db");

class UserModel {
  static async getById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  }

  static async getAll() {
    const query = "SELECT * FROM users";
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = UserModel;
