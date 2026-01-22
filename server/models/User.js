const { query } = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

class User {
  static async findByUsername(username) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(username, password, role = 'viewer') {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
      [username, passwordHash, role]
    );
    return result.rows[0];
  }

  static async validatePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static async updateLastLogin(id) {
    await query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [id]);
  }
}

module.exports = User;
