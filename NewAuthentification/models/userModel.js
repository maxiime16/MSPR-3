const pool = require("../config/db");

class UserModel {
  static async getAll() {
    try {
      const result = await pool.query('SELECT * FROM users');
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching all users: ${err.message}`);
    }
  }

  static async getByEmail(email) {
    try {
      const result = await pool.query('SELECT * FROM "users" WHERE email = $1', [email]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error fetching user by email: ${err.message}`);
    }
  }

  static async getById(id) {
    try {
      const result = await pool.query('SELECT * FROM "users" WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error fetching user by ID: ${err.message}`);
    }
  }

  static async update(userId, { first_name, last_name, email }) {
    try {
      const result = await pool.query(
        'UPDATE "users" SET email = $1, first_name = $2, last_name = $3 WHERE id = $4 RETURNING *',
        [email, first_name, last_name, userId]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error updating user: ${err.message}`);
    }
  }

  static async createUser({ first_name, last_name, email, password }) {
    try {
      const result = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, email, password]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating user: ${err.message}`);
    }
  }

  static async delete(userId) {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    } catch (err) {
      throw new Error(`Error deleting user: ${err.message}`);
    }
  }
}

module.exports = UserModel;
