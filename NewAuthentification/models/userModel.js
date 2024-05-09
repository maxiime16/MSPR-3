const pool = require("../config/db");

class UserModel {
  static async getAll() {
    try {
      const user  = await pool.query('SELECT * FROM users');
      return user.rows;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getByEmail(email) {
    try {
      const user = await pool.query('SELECT * FROM "users" WHERE email = $1', [
        email,
      ]);
      return user.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async getById(id) {
    try {
      const user = await pool.query(
        'SELECT id, email, first_name AS name, last_name FROM "users" WHERE id = $1',
        [id]
      );
      return user.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async update(userId, { first_name, last_name, email }) {
    try {
      const updateUserDataResult = await pool.query(
        'UPDATE "users" SET email = $1, first_name = $2, last_name = $3 WHERE id = $4',
        [first_name, last_name, email, userId]
      );
      return updateUserDataResult.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async createUser({ first_name, last_name, email, password }) {
    try {
      const newUserDataResult = await pool.query(
        'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [first_name, last_name, email, password]
      );
      return newUserDataResult.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  }

  static async delete(userId) {
    try {
      await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = UserModel;
